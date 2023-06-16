import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getPureSelections, getSelectionLines, replaceSelectionsWithLines, sortSelectionsByPosition } from "../helpers/vsCodeHelpers";

interface JoinLinesOptions {
	numberOfJoinedLines?: number;
	joinString?: string;
}

export async function runJoinLinesCommand(options: JoinLinesOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	if (options.numberOfJoinedLines == null) {
		askForNumberOfJoinedLines(editor, options);
	} else if (options.joinString == null) {
		askForJoinString(editor, options.numberOfJoinedLines);
	} else {
		joinLinesInternal(editor, options.numberOfJoinedLines, options.joinString);
	}
}

async function askForNumberOfJoinedLines(editor: vscode.TextEditor, options: JoinLinesOptions) {
	vscode.window.showInputBox({
		prompt: "Please enter the number of consecutive lines to join together",
	}).then(async (rawPadLength: string | undefined) => {
		if (typeof rawPadLength === "undefined") {
			return;
		}

		if (!rawPadLength) {
			vscode.window.showErrorMessage("No line count entered.");
			return;
		}

		const lineCount = Number.parseInt(rawPadLength, 10);
		if (isNaN(lineCount)) {
			vscode.window.showErrorMessage("The entered line count is not a valid number.");
			return;
		}

		if (lineCount < 2 || lineCount > 100) {
			vscode.window.showErrorMessage("The entered line count is not supported (≥ 2 and ≤ 100).");
			return;
		}

		if (options.joinString == null) {
			askForJoinString(editor, lineCount);
		} else {
			joinLinesInternal(editor, lineCount, options.joinString);
		}
	});
}

async function askForJoinString(editor: vscode.TextEditor, numberOfJoinedLines: number) {
	vscode.window.showInputBox({
		prompt: "Please enter the string used for joining",
	}).then(async (joinString: string | undefined) => {
		if (typeof joinString === "undefined") {
			return;
		}

		if (joinString == null) {
			vscode.window.showErrorMessage("No pad string entered.");
			return;
		}

		joinLinesInternal(editor, numberOfJoinedLines, joinString);
	});
}

async function joinLinesInternal(editor: vscode.TextEditor, numberOfJoinedLines: number, joinString: string) {
	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);

	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		const currentSelectionLines: string[] = [];

		let i = 0;
		for (const lineContent of getSelectionLines(editor, selection)) {
			if (i % numberOfJoinedLines === 0) {
				currentSelectionLines.push(lineContent);
			} else {
				currentSelectionLines[currentSelectionLines.length - 1] += joinString + lineContent;
			}

			i++;
		}

		linesBySelection.push(currentSelectionLines);
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
