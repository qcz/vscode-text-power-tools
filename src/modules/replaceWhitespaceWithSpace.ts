import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export async function runReplaceWhitespaceWithASingleSpace() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);

	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		const cleanedLines: string[] = [];

		for (const line of getSelectionLines(editor, selection)) {
			cleanedLines.push(line.replace(/\s+/g, " "));
		}

		linesBySelection.push(cleanedLines);
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
