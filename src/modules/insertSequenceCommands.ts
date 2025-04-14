import * as vscode from "vscode";
import { QuickPickItem } from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getKnownFakeSequences } from "../sequences/fakeSequences";
import { RandomFromUserInputSequence } from "../sequences/fakeSequences/randomFromUserInputSequence";
import { GeneratedGuidType, KNOWN_GUID_TYPES, RandomGuidsSequence } from "../sequences/fakeSequences/randomGuidsSequence";
import { SequenceBase } from "../sequences/sequenceBase";
import { insertSequenceInternal } from "../sequences/sequenceInserter";
import { isSequenceErrorMessage as isGeneratorCreationError, isSequenceErrorMessage } from "../sequences/sequenceTypes";
import { getKnownStandardSequences } from "../sequences/standardSequences";

export const enum InsertableSeries {
	UserSelectionOfStandardSeries,
	UserSelectionOfFakeSeries,
	RandomFromUserInput,
	RandomGuids,
}

interface IInsertPredefinedSeriesOptions {
	series?: InsertableSeries;
	sequence?: SequenceBase;
};

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

	let sequence: SequenceBase | null = null;

	if (typeof options.series !== "undefined") {
		switch (options.series) {
			case InsertableSeries.RandomFromUserInput:
				sequence = new RandomFromUserInputSequence(context, undefined);
				break;

			case InsertableSeries.RandomGuids: {
				const settingAsGuidType = settings.defaultGuidType as GeneratedGuidType;
				sequence = new RandomGuidsSequence(KNOWN_GUID_TYPES.indexOf(settingAsGuidType) !== -1
					? settingAsGuidType
					: undefined);
				break;
			}

			case InsertableSeries.UserSelectionOfFakeSeries:
				showPredefinedSeriesPicker(editor, await getFakeSeriesQuickPickItems(context));
				break;
			case InsertableSeries.UserSelectionOfStandardSeries:
			default:
				showPredefinedSeriesPicker(editor, await getStandardSeriesQuickPickItems());
				break;
		}
	} else {
		sequence = options.sequence ?? null;
	}

	if (sequence !== null) {
		const generator = await sequence.createGenerator();
		if (isGeneratorCreationError(generator)) {
			vscode.window.showErrorMessage(
				vscode.l10n.t("Failed to generate items: {0}", generator.errorMessage));
			return;
		}

		insertSequenceInternal(editor, generator);
	}
}

interface SequenceQuickPickItem extends QuickPickItem {
	sequenceInstance: SequenceBase;
}

function showPredefinedSeriesPicker(editor: vscode.TextEditor, qpItems: SequenceQuickPickItem[]): void {
	const qp = vscode.window.createQuickPick<SequenceQuickPickItem>();
	qp.title = vscode.l10n.t("Select a predefined series");
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

