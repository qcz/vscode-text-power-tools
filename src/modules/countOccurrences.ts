import * as vscode from "vscode";
import { getSelectionLines, getSelections, replaceLinesOfSelections } from "../helpers/vsCodeHelpers";
import { NO_ACTIVE_EDITOR } from "../consts";

export interface CountLinesCommandOptions {
	inNewEditor: boolean;
}

export async function countOccurrences(options: CountLinesCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelections(editor);
	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		const lineCounter: { [index: string]: number } = {};
		
		for (const lineContent of getSelectionLines(editor, selection)) {
			
			if (lineCounter[lineContent]) {
				lineCounter[lineContent]++;
			} else {
				lineCounter[lineContent] = 1;
			}
		}
		
		linesBySelection.push([]);

		const sortableLines: [string, number][] = [];
		for (const key in lineCounter) {
			sortableLines.push([key, lineCounter[key]]);
		}
		sortableLines.sort((a, b) => {
			return b[1] - a[1];
		});

		for (const ele of sortableLines) {
			linesBySelection[linesBySelection.length - 1].push(`${ele[1]}\t${ele[0]}`);
		}
	}

	await replaceLinesOfSelections(editor, selections, linesBySelection, options.inNewEditor);
}
