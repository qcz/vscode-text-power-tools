import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface ICountLinesCommandOptions {
	inNewEditor: boolean;
}

export async function runCountOccurrencesCommand(options: ICountLinesCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);
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
		for (const key of Object.keys(lineCounter)) {
			sortableLines.push([key, lineCounter[key]]);
		}
		sortableLines.sort((a, b) => {
			return b[1] - a[1];
		});

		for (const ele of sortableLines) {
			linesBySelection[linesBySelection.length - 1].push(`${ele[1]}\t${ele[0]}`);
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, options.inNewEditor);
}
