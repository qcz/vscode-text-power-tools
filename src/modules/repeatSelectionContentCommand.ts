import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getPureSelections, getSelectionContent, replaceSelectionsWithLines, sortSelectionsByPosition } from "../helpers/vsCodeHelpers";

export enum  PadDirection {
	Start,
	End,
}

interface RepeatSelectionContentOptions {
	repeatCount?: number;
}

export async function runRepeatSelectionContentCommand(options?: RepeatSelectionContentOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}


	if (typeof options?.repeatCount === "number") {
		repeatSelectionContentInternal(editor, options.repeatCount);
	} else {
		askForRepeatCount(editor);
	}
}

function askForRepeatCount(editor: vscode.TextEditor) {
	vscode.window.showInputBox({
		prompt: "Please enter how many times the selection content should be repeadted (at least 2)",
	}).then(async (rawPadLength: string | undefined) => {
		if (typeof rawPadLength === "undefined") {
			return;
		}

		if (!rawPadLength) {
			vscode.window.showErrorMessage("No repeat count entered.");
			return;
		}

		const repeatCount = Number.parseInt(rawPadLength, 10);
		if (isNaN(repeatCount) || repeatCount < 2) {
			vscode.window.showErrorMessage("The entered repeat count is not a valid number.");
			return;
		}

		repeatSelectionContentInternal(editor, repeatCount);
	});
}

async function repeatSelectionContentInternal(editor: vscode.TextEditor, repeatCount: number) {
	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);

	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];

		const content = getSelectionContent(editor, selection);
		currentSelectionLines.push(content.repeat(repeatCount));
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
