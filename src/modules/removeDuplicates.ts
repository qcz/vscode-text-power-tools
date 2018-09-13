import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelections, replaceLinesOfSelections } from "../helpers/vsCodeHelpers";

export async function removeDuplicates() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const matchingLinesBySelection: string[][] = [];
	const selections = getSelections(editor);
		
	for (const selection of selections) {
		matchingLinesBySelection.push([]);

		for (const lineContent of getSelectionLines(editor, selection)) {
			if (matchingLinesBySelection[matchingLinesBySelection.length - 1].indexOf(lineContent) === -1) {
				matchingLinesBySelection[matchingLinesBySelection.length - 1].push(lineContent);
			}
		}
	}

	await replaceLinesOfSelections(editor, selections, matchingLinesBySelection, false);
}
