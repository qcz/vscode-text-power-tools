import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { removeControlCharacters } from "../helpers/transformations";
import { getSelectionsOrFullDocument, replaceSelectionsWithText } from "../helpers/vsCodeHelpers";

export async function runRemoveControlCharactersCommand() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);
	const replacements: string[] = [];
	for (const selection of selections) {
		const text = editor.document.getText(selection);
		replacements.push(removeControlCharacters(text));
	}

	await replaceSelectionsWithText(editor, selections, replacements);
}
