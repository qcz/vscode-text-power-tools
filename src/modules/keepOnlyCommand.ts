import * as vscode from "vscode";
import { COMMAND_CALL_ERROR, NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface KeepOnlyCommandOptions {
	what: "duplicates" | "uniques";
	onlyAdjacent: boolean;
	caseSensitive: boolean;
}

export async function runKeepOnlyCommand(options: KeepOnlyCommandOptions) {
	if (options.what === "uniques" && options.onlyAdjacent === true) {
		vscode.window.showErrorMessage(COMMAND_CALL_ERROR + " runKeepOnlyCommand, what: uniques, onlyAdjacent: true");
		return;
	}

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

		let lineCounter: Map<string, number> = new Map();
		let lastLine: string | null = null;

		for (const lineContent of getSelectionLines(editor, selection)) {
			const normalizedLineContent = options.caseSensitive
				? lineContent
				: lineContent.toLocaleLowerCase();

			if (options.onlyAdjacent && normalizedLineContent !== lastLine) {
				lineCounter.clear();
			}

			if (lineCounter.has(normalizedLineContent)) {
				lineCounter.set(normalizedLineContent, lineCounter.get(normalizedLineContent)! + 1);

				if (options.what === "duplicates" && lineCounter.get(normalizedLineContent) === 2) {
					currentSelectionLines.push(lineContent);
				}
			} else {
				lineCounter.set(normalizedLineContent, 1);
			}

			lastLine = normalizedLineContent;
		}

		if (options.what === "uniques") {
			for (const lineContent of getSelectionLines(editor, selection)) {
				const normalizedLineContent = options.caseSensitive
					? lineContent
					: lineContent.toLocaleLowerCase();

				if (lineCounter.get(normalizedLineContent) === 1) {
					currentSelectionLines.push(lineContent);
				}
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, matchingLinesBySelection, false);
}
