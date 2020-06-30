import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getPureSelections, getSelectionLines, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export async function runCopySelectionsToNewEditorCommand() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getPureSelections(editor);
	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		linesBySelection.push([...getSelectionLines(editor, selection)]);
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /*openNewDocument*/ true);
}
