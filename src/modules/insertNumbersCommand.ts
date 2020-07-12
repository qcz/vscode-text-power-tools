import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getPureSelections, replaceSelectionsWithLines, sortSelectionsByPosition } from "../helpers/vsCodeHelpers";
import { NumeralSystem } from "../interfaces";

interface InsertNumbersOptions {
	numberFormat: NumeralSystem;
	askForIncrements: boolean;
	askForStartingNumber: boolean;
}

export async function runInsertNumbersCommand(options: InsertNumbersOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	if (options.askForStartingNumber) {
		askForStartingNumber(editor, options);
	} else if (options.askForIncrements) {
		askForIncrements(editor, options.numberFormat, 1);
	} else {
		insertNumbersInternal(editor, options.numberFormat, 1, 1);
	}
}

export async function askForStartingNumber(editor: vscode.TextEditor, options: InsertNumbersOptions) {
	const numberType = options.numberFormat === NumeralSystem.Decimal ? "decimal" : "hex";

	vscode.window.showInputBox({
		placeHolder: `Please enter the starting number in ${numberType} format`,
		value: "1",
	}).then(async (filter: string | undefined) => {
		if (typeof filter === "undefined") {
			return;
		}

		if (!filter) {
			vscode.window.showErrorMessage("No starting number entered.");
			return;
		}

		const startingNumber = Number.parseInt(filter, options.numberFormat === NumeralSystem.Decimal ? 10 : 16);
		if (isNaN(startingNumber)) {
			vscode.window.showErrorMessage(`The entered starting number is not a valid ${numberType} number.`);
			return;
		}

		if (options.askForIncrements) {
			askForIncrements(editor, options.numberFormat, startingNumber);
		} else {
			insertNumbersInternal(editor, options.numberFormat, 1, startingNumber);
		}
	});
}

export async function askForIncrements(editor: vscode.TextEditor, numberFormat: NumeralSystem, startingNumber: number) {
	const numberType = numberFormat === NumeralSystem.Decimal ? "decimal" : "hex";

	vscode.window.showInputBox({
		placeHolder: `Please enter the number to increment by in ${numberType} format`,
		value: "1",
	}).then(async (filter: string | undefined) => {
		if (typeof filter === "undefined") {
			return;
		}

		if (!filter) {
			vscode.window.showErrorMessage("No increment entered.");
			return;
		}

		const increments = Number.parseInt(filter, numberFormat === NumeralSystem.Decimal ? 10 : 16);
		if (isNaN(increments)) {
			vscode.window.showErrorMessage(`The entered number to increment by is not a valid ${numberType} number.`);
			return;
		}

		insertNumbersInternal(editor, numberFormat, increments, startingNumber);
	});
}


export async function insertNumbersInternal(editor: vscode.TextEditor, numberFormat: NumeralSystem, increments: number, startingNumber: number) {
	const settings = getExtensionSettings();
	const replacesBySelection: string[][] = [];
	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);
	
	let insertedNumber: number = startingNumber;
	for (let i = 0, len = selections.length; i < len; i++) {
		if (numberFormat === NumeralSystem.Hexadecimal) {
			let insertedString = insertedNumber.toString(16);
			if (settings.insertUppercaseHexNumbers) {
				insertedString = insertedString.toLocaleUpperCase();
			}

			replacesBySelection.push([insertedString]);
		} else {
			replacesBySelection.push([insertedNumber.toString()]);
		}

		insertedNumber += increments;
	}

	await replaceSelectionsWithLines(editor, selections, replacesBySelection, false);
}