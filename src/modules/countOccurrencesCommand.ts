import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface ICountLinesCommandOptions {
	onlyAdjacent: boolean;
	inNewEditor: boolean;
}

interface LineAppearanceCount {
	content: string;
	count: number;
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
		let lastLine: string | null = null;

		let currentCounter: Map<string, number> = new Map();
		const finalCountLines: LineAppearanceCount[] = [];

		for (const lineContent of getSelectionLines(editor, selection)) {
			if (options.onlyAdjacent && lastLine !== lineContent) {
				addCountResults(currentCounter, finalCountLines);
				currentCounter.clear();
			}

			if (currentCounter.has(lineContent)) {
				currentCounter.set(lineContent, currentCounter.get(lineContent)! + 1);
			} else {
				currentCounter.set(lineContent, 1);
			}

			lastLine = lineContent;
		}

		addCountResults(currentCounter, finalCountLines);

		const maxNumberLength: number = finalCountLines.reduce<number>(
			(max, val) => {
				const numberLength = val.count.toFixed().length;
				return max < numberLength ? numberLength : max;
			},
			0
		);

		for (const ele of finalCountLines) {
			currentSelectionLines.push(`${ele.count.toFixed().padStart(maxNumberLength, " ")}\t${ele.content}`);
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, options.inNewEditor);
}

function addCountResults(lineCounter: Map<string, number>, finalCountLines: LineAppearanceCount[]): void {
	const keys = [...lineCounter.keys()];
	if (keys.length ===  0) {
		return;
	}

	const sortableLines: LineAppearanceCount[] = [];
	for (const key of keys) {
		sortableLines.push({
			content: key,
			count: lineCounter.get(key)!
		});
	}
	sortableLines.sort((a, b) => {
		return b.count - a.count;
	});

	finalCountLines.push(...sortableLines);
}

