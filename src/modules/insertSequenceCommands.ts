import * as vscode from "vscode";
import { QuickPickItem } from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getKnownFakeSequences } from "../sequences/fakeSequences";
import { LoremIpsumParagraphsSequence } from "../sequences/fakeSequences/loremIpsumParagraphsSequence";
import { LoremIpsumSentencesSequence } from "../sequences/fakeSequences/loremIpsumSentencesSequence";
import { RandomFromUserInputSequence } from "../sequences/fakeSequences/randomFromUserInputSequence";
import { GeneratedGuidType, KNOWN_GUID_TYPES, RandomGuidsSequence } from "../sequences/fakeSequences/randomGuidsSequence";
import { IpAddressType, RandomIpAdressesSequence } from "../sequences/fakeSequences/randomIpAdressesSequence";
import { ASequenceBase } from "../sequences/sequenceBase";
import { insertSequenceInternal } from "../sequences/sequenceInserter";
import { isSequenceErrorMessage as isGeneratorCreationError, isSequenceErrorMessage } from "../sequences/sequenceTypes";
import { getKnownStandardSequences } from "../sequences/standardSequences";
import { DayNamesSequence } from "../sequences/standardSequences/dayNameSequence";
import { LowercaseGreekLettersSequence } from "../sequences/standardSequences/lowercaseGreekLettersSequence";
import { LowercaseLettersSequence } from "../sequences/standardSequences/lowercaseLettersSequence";
import { MonthNamesSequence } from "../sequences/standardSequences/monthNamesSequence";
import { NatoPhoneticAlphabetSequence } from "../sequences/standardSequences/natoPhoneticAlphabetSequence";
import { UppercaseGreekLettersSequence } from "../sequences/standardSequences/uppercaseGreekLettersSequence";
import { UppercaseLettersSequence } from "../sequences/standardSequences/uppercaseLettersSequence";

export const enum InsertableSeries {
	UserSelectionOfStandardSeries,
	UserSelectionOfFakeSeries,

	LowercaseLetters,
	UppercaseLetters,
	LowercaseGreekLetters,
	UppercaseGreekLetters,
	NatoPhoneticAlphabet,
	LongEnglishMonthNames,
	ShortEnglishMonthNames,
	LongLocaleMonthNames,
	ShortLocaleMonthNames,
	LongEnglishDayNames,
	ShortEnglishDayNames,
	LongLocaleDayNames,
	ShortLocaleDayNames,
	RandomGuids,
	RandomIpv4Addresses,
	RandomIpv6Addresses,
	LoremIpsumSentences,
	LoremIpsumParagraphs,

	RandomFromUserInput
}

interface IInsertPredefinedSeriesOptions {
	series: InsertableSeries;
}

export async function runInsertPredefinedSeriesCommand(
	context: vscode.ExtensionContext,
	options: IInsertPredefinedSeriesOptions
) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const settings = getExtensionSettings();

	let seqClass: ASequenceBase | null = null;
	switch (options.series) {
		case InsertableSeries.LowercaseLetters:
			seqClass = new LowercaseLettersSequence();
			break;
		case InsertableSeries.UppercaseLetters:
			seqClass = new UppercaseLettersSequence();
			break;
		case InsertableSeries.LowercaseGreekLetters:
			seqClass = new LowercaseGreekLettersSequence();
			break;
		case InsertableSeries.UppercaseGreekLetters:
			seqClass = new UppercaseGreekLettersSequence();
			break;
		case InsertableSeries.NatoPhoneticAlphabet:
			seqClass = new NatoPhoneticAlphabetSequence();
			break;
		case InsertableSeries.LongEnglishMonthNames:
			seqClass = new MonthNamesSequence("en-US", "long");
			break;
		case InsertableSeries.ShortEnglishMonthNames:
			seqClass = new MonthNamesSequence("en-US", "short");
			break;
		case InsertableSeries.LongLocaleMonthNames:
			seqClass = new MonthNamesSequence(undefined, "long");
			break;
		case InsertableSeries.ShortLocaleMonthNames:
			seqClass = new MonthNamesSequence(undefined, "short");
			break;
		case InsertableSeries.LongEnglishDayNames:
			seqClass = new DayNamesSequence("en-US", "long");
			break;
		case InsertableSeries.ShortEnglishDayNames:
			seqClass = new DayNamesSequence("en-US", "short");
			break;
		case InsertableSeries.LongLocaleDayNames:
			seqClass = new DayNamesSequence(undefined, "long");
			break;
		case InsertableSeries.ShortLocaleDayNames:
			seqClass = new DayNamesSequence(undefined, "short");
			break;
		case InsertableSeries.RandomGuids: {
			const settingAsGuidType = settings.defaultGuidType as GeneratedGuidType;
			seqClass = new RandomGuidsSequence(KNOWN_GUID_TYPES.indexOf(settingAsGuidType) !== -1
				? settingAsGuidType
				: undefined);
			break;
		}
		case InsertableSeries.RandomIpv4Addresses:
			seqClass = new RandomIpAdressesSequence(IpAddressType.Ipv4);
			break;
		case InsertableSeries.RandomIpv6Addresses:
			seqClass = new RandomIpAdressesSequence(IpAddressType.Ipv6);
			break;
		case InsertableSeries.LoremIpsumSentences:
			seqClass = new LoremIpsumSentencesSequence();
			break;
		case InsertableSeries.LoremIpsumParagraphs:
			seqClass = new LoremIpsumParagraphsSequence();
			break;
		case InsertableSeries.RandomFromUserInput:
			seqClass = new RandomFromUserInputSequence(context, undefined);
			break;
		case InsertableSeries.UserSelectionOfFakeSeries:
			showPredefinedSeriesPicker(editor, await getFakeSeriesQuickPickItems(context));
			break;
		case InsertableSeries.UserSelectionOfStandardSeries:
		default:
			showPredefinedSeriesPicker(editor, await getStandardSeriesQuickPickItems());
			break;
	}

	if (seqClass !== null) {
		const generator = await seqClass.createGenerator();
		if (isGeneratorCreationError(generator)) {
			vscode.window.showErrorMessage(`Failed to generate items: ${generator.errorMessage}`);
			return;
		}

		insertSequenceInternal(editor, generator);
	}
}

interface SequenceQuickPickItem extends QuickPickItem {
	sequenceInstance: ASequenceBase;
}

function showPredefinedSeriesPicker(editor: vscode.TextEditor, qpItems: SequenceQuickPickItem[]): void {
	const qp = vscode.window.createQuickPick<SequenceQuickPickItem>();
	qp.title = "Select a predefined series";
	qp.items = qpItems;

	qp.onDidChangeValue(() => {
		if (qp.activeItems.length > 0) {
			if (qp.activeItems[0].label !== qp.value) {
				qp.activeItems = [];
			}
		}
	});
	qp.onDidAccept(async () => {
		let selectedValue: SequenceQuickPickItem | null = null;
		if (qp.activeItems.length) {
			selectedValue = qp.activeItems[0];
		}

		if (!selectedValue) {
			return;
		}

		qp.hide();
		qp.dispose();

		const generatorResult = await selectedValue.sequenceInstance.createGenerator();
		if (isSequenceErrorMessage(generatorResult)) {
			vscode.window.showErrorMessage(generatorResult.errorMessage);
			return;
		}

		insertSequenceInternal(editor, generatorResult);
	});
	qp.activeItems = [];
	qp.show();
};

async function getStandardSeriesQuickPickItems(): Promise<SequenceQuickPickItem[]> {
	const quickPickItems: SequenceQuickPickItem[] = [];
	for (const seq of getKnownStandardSequences()) {
		quickPickItems.push({
			label: `$(${seq.icon}) ${seq.name}`,
			detail: `$(blank) $(blank) $(blank) $(blank) $(blank) ${await seq.getSample()}`,
			sequenceInstance: seq
		});
	}
	return quickPickItems;
}

async function getFakeSeriesQuickPickItems(context: vscode.ExtensionContext): Promise<SequenceQuickPickItem[]> {
	const quickPickItems: SequenceQuickPickItem[] = [];
	for (const seq of getKnownFakeSequences(context)) {
		quickPickItems.push({
			label: `$(${seq.icon}) ${seq.name}`,
			detail: `$(blank) $(blank) $(blank) $(blank) $(blank) ${await seq.getSample()}`,
			sequenceInstance: seq
		});
	}
	return quickPickItems;
}

