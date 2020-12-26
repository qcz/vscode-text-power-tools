import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { insertSequenceInternal } from "../sequences/sequenceInserter";
import { LowercaseLettersSequence } from "../sequences/implementations/lowercaseLettersSequence";
import { UppercaseGreekLettersSequence } from "../sequences/implementations/uppercaseGreekLettersSequence";
import { UppercaseLettersSequence } from "../sequences/implementations/uppercaseLettersSequence";
import { LowercaseGreekLettersSequence } from "../sequences/implementations/lowercaseGreekLettersSequence";
import { NatoPhoneticAlphabetSequence } from "../sequences/implementations/natoPhoneticAlphabetSequence";
import { MonthNamesSequence } from "../sequences/implementations/monthNamesSequence";
import { DayNamesSequence } from "../sequences/implementations/dayNameSequence";
import { ASequenceBase } from "../sequences/sequenceBase";
import { knownSequences } from "../sequences/implementations";
import { QuickPickItem } from "vscode";

export const enum InsertableSeries {
	UserSelection,

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
}

interface IInsertPredefinedSeriesOptions {
	series: InsertableSeries;
}

export async function runInsertPredefinedSeriesCommand(options: IInsertPredefinedSeriesOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

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
		default:
			showPredefinedSeriesPicker(editor);
			break;
	}

	if (seqClass !== null) {
		insertSequenceInternal(editor, seqClass.createGenerator());
	}
}

interface SequenceQuickPickItem extends QuickPickItem {
	sequenceInstance: ASequenceBase;
}

const showPredefinedSeriesPicker = (editor: vscode.TextEditor) => {
	const qp = vscode.window.createQuickPick<SequenceQuickPickItem>();
	qp.title = "Select a predefined series";
	qp.items = knownSequences.map(x => {
		return {
			label: x.name,
			detail: x.sample,
			sequenceInstance: x
		};
	});
	qp.onDidChangeValue(() => {
		if (qp.activeItems.length > 0) {
			if (qp.activeItems[0].label !== qp.value) {
				qp.activeItems = [];
			}
		}
	});
	qp.onDidAccept(() => {
		let selectedValue: SequenceQuickPickItem | null = null;
		if (qp.activeItems.length) {
			selectedValue = qp.activeItems[0];
		}

		if (!selectedValue) {
			return;
		}

		qp.hide();
		qp.dispose();

		insertSequenceInternal(editor, selectedValue.sequenceInstance.createGenerator());
	});
	qp.activeItems = [];
	qp.show();
};
