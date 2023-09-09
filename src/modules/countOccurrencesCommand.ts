import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface ICountLinesCommandOptions {
	onlyAdjacent: boolean;
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
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];
		let lineCounter: { [index: string]: number } = {};
		let lastLine: string | null = null;

		for (const lineContent of getSelectionLines(editor, selection)) {
			if (options.onlyAdjacent && lastLine !== lineContent) {
				printCountResults(lineCounter, currentSelectionLines);
				lineCounter = {};
			}

			if (lineCounter[lineContent]) {
				lineCounter[lineContent]++;
			} else {
				lineCounter[lineContent] = 1;
			}

			lastLine = lineContent;
		}

		printCountResults(lineCounter, currentSelectionLines);
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, options.inNewEditor);
}

function printCountResults(lineCounter: { [index: string]: number }, currentSelectionLines: string[]): void {
	const keys = Object.keys(lineCounter);
	if (keys.length ===  0) {
		return;
	}

	const sortableLines: [string, number][] = [];
	for (const key of keys) {
		sortableLines.push([key, lineCounter[key]]);
	}
	sortableLines.sort((a, b) => {
		return b[1] - a[1];
	});

	for (const ele of sortableLines) {
		currentSelectionLines.push(`${ele[1]}\t${ele[0]}`);
	}
}

