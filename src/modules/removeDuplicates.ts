import * as vscode from "vscode";
import { getSelectionLines, getSelections, replaceLinesOfSelections } from "../helpers/vsCodeHelpers";

export async function removeDuplicates() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage("Please open an editor to use this function.");
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
