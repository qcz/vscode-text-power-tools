import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { insertSequenceInternal } from "../sequences/sequenceInserter";
import { getExtensionSettings } from "../helpers/tptSettings";
import { NumeralSystem } from "../interfaces";
import RomanNumeral  from "js-roman-numerals";

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
		insertSequenceInternal(
			editor,
			createNumbersGenerator(options.numberFormat, 1, 1)
		);
	}
}

export async function askForStartingNumber(editor: vscode.TextEditor, options: InsertNumbersOptions) {
	const numberType = options.numberFormat === NumeralSystem.Hexadecimal ? "hex" : "decimal";

	vscode.window.showInputBox({
		prompt: `Please enter the starting number in ${numberType} format`,
		value: "1",
	}).then(async (filter: string | undefined) => {
		if (typeof filter === "undefined") {
			return;
		}

		if (!filter) {
			vscode.window.showErrorMessage("No starting number entered.");
			return;
		}

		const startingNumber = Number.parseInt(filter, options.numberFormat === NumeralSystem.Hexadecimal ? 16 : 10);
		if (isNaN(startingNumber)) {
			vscode.window.showErrorMessage(`The entered starting number is not a valid ${numberType} number.`);
			return;
		}

		// TODO: warn for too big roman number

		if (options.askForIncrements) {
			askForIncrements(editor, options.numberFormat, startingNumber);
		} else {
			insertSequenceInternal(
				editor,
				createNumbersGenerator(options.numberFormat, 1, startingNumber)
			);
		}
	});
}

export async function askForIncrements(editor: vscode.TextEditor, numberFormat: NumeralSystem, startingNumber: number) {
	const numberType = numberFormat === NumeralSystem.Hexadecimal ? "hex" : "decimal";

	vscode.window.showInputBox({
		prompt: `Please enter the number to increment by in ${numberType} format`,
		value: "1",
	}).then(async (filter: string | undefined) => {
		if (typeof filter === "undefined") {
			return;
		}

		if (!filter) {
			vscode.window.showErrorMessage("No increment entered.");
			return;
		}

		const increments = Number.parseInt(filter, numberFormat === NumeralSystem.Hexadecimal ? 16 : 10);
		if (isNaN(increments)) {
			vscode.window.showErrorMessage(`The entered number to increment by is not a valid ${numberType} number.`);
			return;
		}

		insertSequenceInternal(
			editor,
			createNumbersGenerator(numberFormat, increments, startingNumber)
		);
	});
}

function createNumbersGenerator(numberFormat: NumeralSystem, increments: number, startingNumber: number): () => IterableIterator<string> {
	const fun = function* () {
		const settings = getExtensionSettings();
		let insertedNumber: number = startingNumber;
		while (true) {
			if (numberFormat === NumeralSystem.Roman) {
				if (insertedNumber > 3999 || insertedNumber < 1) {
					yield insertedNumber.toString();
				}

				yield new RomanNumeral(insertedNumber).toString();
			} else if (numberFormat === NumeralSystem.Hexadecimal) {
				let insertedString = insertedNumber.toString(16);
				if (settings.insertUppercaseHexNumbers) {
					insertedString = insertedString.toLocaleUpperCase();
				}
	
				yield insertedString;
			} else {
				yield insertedNumber.toString();
			}
	
			insertedNumber += increments;
		}
	};

	return fun;
}
