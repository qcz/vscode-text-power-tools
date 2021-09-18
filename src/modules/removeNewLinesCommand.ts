import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface RemoveNewLinesOptions {
	trimWhitespace: boolean;
}

export async function runRemoveNewLinesCommand(options: RemoveNewLinesOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const { trimWhitespace } = options;
	const selections = getSelectionsOrFullDocument(editor);

	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		let currentSelectionText = "";

		for (const lineContent of getSelectionLines(editor, selection)) {
			currentSelectionText += trimWhitespace ? lineContent.trim() : lineContent;
		}

		linesBySelection.push([currentSelectionText]);
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
