import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionsOrFullDocument, replaceSelectionsWithText } from "../helpers/vsCodeHelpers";

export async function removeControlCharacters() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);
	const replacements: string[] = [];
	for (const selection of selections) {
		const text = editor.document.getText(selection);
		replacements.push(text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ""));
	}

	await replaceSelectionsWithText(editor, selections, replacements);
}
