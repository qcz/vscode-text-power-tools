import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getPureSelections, getSelectionLines, replaceSelectionsWithLines, sortSelectionsByPosition } from "../helpers/vsCodeHelpers";

export enum  TrimDirection {
	Start,
	End,
	Both
}

interface TrimOptions {
	direction: TrimDirection;
}

export async function runTrimCommand(options: TrimOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const { direction } = options;

	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);

	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];

		for (const lineContent of getSelectionLines(editor, selection)) {
			if (direction === TrimDirection.Start) {
				currentSelectionLines.push(lineContent.trimStart());
			} else if (direction === TrimDirection.End) {
				currentSelectionLines.push(lineContent.trimEnd());
			} else {
				currentSelectionLines.push(lineContent.trim());
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
