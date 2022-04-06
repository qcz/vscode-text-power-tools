import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionContent, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export async function runReplaceNewLinesAndWhitespaceWithASingleSpace() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);

	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		const currentSelectionText = getSelectionContent(editor, selection);

		linesBySelection.push([currentSelectionText.replace(/\s+/g, " ")]);
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
