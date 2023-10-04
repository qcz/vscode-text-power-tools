import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { compareNumbers } from "../helpers/utils";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface KeepRandomLinesCommandOptions {
	unit: "integer" | "percentage";
}

export async function runKeepRandomLinesCommand(options: KeepRandomLinesCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	askForNumberOfLinesToKeep(editor, options.unit);
}

async function askForNumberOfLinesToKeep(editor: vscode.TextEditor, unit: "integer" | "percentage") {
	vscode.window.showInputBox({
		prompt: "Please enter the "
			+ (unit === "integer" ? "number" : "percentage")
			+ " of lines to keep",
	}).then(async (rawPadLength: string | undefined) => {
		if (typeof rawPadLength === "undefined") {
			return;
		}

		if (!rawPadLength) {
			vscode.window.showErrorMessage("No line count entered.");
			return;
		}

		const amount = Number.parseInt(rawPadLength, 10);
		if (isNaN(amount)) {
			vscode.window.showErrorMessage("The entered line count is not a valid number.");
			return;
		}

		if (unit === "percentage" && amount < 1 || amount > 99) {
			vscode.window.showErrorMessage("The entered line count is not supported (≥ 1 and ≤ 99).");
			return;
		} else if (amount < 1) {
			vscode.window.showErrorMessage("Line count must be a positive number.");
		}


		keepRandomLinesInternal(editor, amount, unit);
	});
}

async function keepRandomLinesInternal(editor: vscode.TextEditor, amount: number, unit: "integer" | "percentage") {
	const matchingLinesBySelection: string[][] = [];
	const selections = getSelectionsOrFullDocument(editor);

	for (const selection of selections) {
		matchingLinesBySelection.push([]);
		const currentSelectionLines = matchingLinesBySelection[matchingLinesBySelection.length - 1];

		const allLines = [...getSelectionLines(editor, selection)];

		if (allLines.length === 0) {
			continue;
		}

		let numberOfLinesToKeep = unit === "percentage"
			? Math.floor(allLines.length * (amount / 100))
			: amount;

		if (numberOfLinesToKeep === 0) {
			continue;
		}

		if  (numberOfLinesToKeep >= allLines.length) {
			currentSelectionLines.push(...allLines);
			continue;
		}

		const keepedLines = new Set<number>();

		while (keepedLines.size < numberOfLinesToKeep) {
			const lineToKeep = Math.floor(Math.random() * allLines.length);
			keepedLines.add(lineToKeep);
		}

		const finalLineNumbers = [...keepedLines];
		finalLineNumbers.sort(compareNumbers);

		for (const num of finalLineNumbers) {
			currentSelectionLines.push(allLines[num]);
		}
	}

	await replaceSelectionsWithLines(editor, selections, matchingLinesBySelection, false);
}
