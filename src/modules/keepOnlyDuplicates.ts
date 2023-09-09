import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface KeepDuplicatesOptions {
	onlyAdjacent: boolean;
	caseSensitive: boolean;
}

export async function runKeepDuplicatesCommand(options: KeepDuplicatesOptions) {
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

		let lineCounter: { [index: string]: number } = {};
		let lastLine: string | null = null;

		for (const lineContent of getSelectionLines(editor, selection)) {
			const normalizedLineContent = options.caseSensitive
				? lineContent
				: lineContent.toLocaleLowerCase();

			if (options.onlyAdjacent && normalizedLineContent !== lastLine) {
				lineCounter = {};
			}

			if (lineCounter[normalizedLineContent]) {
				lineCounter[normalizedLineContent]++;

				if (lineCounter[normalizedLineContent] === 2) {
					currentSelectionLines.push(lineContent);
				}
			} else {
				lineCounter[normalizedLineContent] = 1;
			}

			lastLine = normalizedLineContent;
		}
	}

	await replaceSelectionsWithLines(editor, selections, matchingLinesBySelection, false);
}
