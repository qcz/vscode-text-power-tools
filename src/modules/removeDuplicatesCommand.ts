import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface RemoveDuplicatesOptions {
	onlyAdjacent: boolean;
	caseSensitive: boolean;
}

export async function runRemoveDuplicatesCommand(options: RemoveDuplicatesOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const matchingLinesBySelection: string[][] = [];
	const selections = getSelectionsOrFullDocument(editor);

	for (const selection of selections) {
		matchingLinesBySelection.push([]);
		const currentSelectionLines = matchingLinesBySelection[matchingLinesBySelection.length - 1];
		const currentSelectionNormalizedLines: string[] = [];

		for (const lineContent of getSelectionLines(editor, selection)) {
			const normalizedLineContent = options.caseSensitive
				? lineContent
				: lineContent.toLocaleLowerCase();

			if (options.onlyAdjacent) {
				const lastItem: string | null = currentSelectionNormalizedLines.length > 0
					? currentSelectionNormalizedLines[currentSelectionNormalizedLines.length -1]
					: null;

				if (lastItem !== normalizedLineContent) {
					currentSelectionLines.push(lineContent);
					currentSelectionNormalizedLines.push(normalizedLineContent);
				}
			} else {
				if (currentSelectionNormalizedLines.indexOf(normalizedLineContent) === -1) {
					currentSelectionLines.push(lineContent);
					currentSelectionNormalizedLines.push(normalizedLineContent);
				}
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, matchingLinesBySelection, false);
}
