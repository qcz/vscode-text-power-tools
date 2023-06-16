import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getPureSelections, getSelectionLines, replaceSelectionsWithLines, sortSelectionsByPosition } from "../helpers/vsCodeHelpers";

interface SplitLinesOptions {
	splitString?: string;
}

export async function runSplitLinesCommand(options: SplitLinesOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	if (options.splitString == null) {
		askForSplitString(editor);
	} else {
		splitLinesInternal(editor, options.splitString);
	}
}

async function askForSplitString(editor: vscode.TextEditor) {
	vscode.window.showInputBox({
		prompt: "Please enter the string to split by",
	}).then(async (splitString: string | undefined) => {
		if (typeof splitString === "undefined") {
			return;
		}

		if (!splitString) {
			vscode.window.showErrorMessage("No split string entered.");
			return;
		}

		splitLinesInternal(editor, splitString);
	});
}

async function splitLinesInternal(editor: vscode.TextEditor, splitString: string) {
	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);

	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		const currentSelectionLines: string[] = [];

		for (const lineContent of getSelectionLines(editor, selection)) {
			currentSelectionLines.push(...lineContent.split(splitString));
		}

		linesBySelection.push(currentSelectionLines);
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
