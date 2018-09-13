import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelections, replaceLinesOfSelections } from "../helpers/vsCodeHelpers";

export interface RemoveBlankLinesCommandOptions {
	onlySurplus: boolean;
}

export async function removeBlankLines(options: RemoveBlankLinesCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const matchingLinesBySelection: string[][] = [];
	const selections = getSelections(editor);

	for (const selection of selections) {
		matchingLinesBySelection.push([]);

		let previousIsBlank: boolean = false;
		for (const lineContent of getSelectionLines(editor, selection)) {
			if (lineContent || (!lineContent && !previousIsBlank && options.onlySurplus)) {
				matchingLinesBySelection[matchingLinesBySelection.length - 1].push(lineContent);
			}

			previousIsBlank = !lineContent;
		}
	}

	await replaceLinesOfSelections(editor, selections, matchingLinesBySelection, false);
}
