import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const WHITESPACE_REGEXP: RegExp = /^\s+$/;

export enum RemovedLineType {
	Empty,
	Blank
}

interface IRemoveLinesCommandOptions {
	type: RemovedLineType;
	onlySurplus: boolean;
}

export async function runRemoveLinesCommand(options: IRemoveLinesCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const matchingLinesBySelection: string[][] = [];
	const selections = getSelectionsOrFullDocument(editor);

	for (const selection of selections) {
		matchingLinesBySelection.push([]);

		let previousIsBlank: boolean = false;
		for (const lineContent of getSelectionLines(editor, selection)) {
			const lineShouldBeRemoved = options.type === RemovedLineType.Blank
				? (!lineContent || WHITESPACE_REGEXP.test(lineContent))
				: !lineContent;

			if (lineShouldBeRemoved === false
				|| (lineShouldBeRemoved && !previousIsBlank && options.onlySurplus)
			) {
				matchingLinesBySelection[matchingLinesBySelection.length - 1].push(lineContent);
			}

			previousIsBlank = lineShouldBeRemoved;
		}
	}

	await replaceSelectionsWithLines(editor, selections, matchingLinesBySelection, false);
}
