import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";
import { NumeralSystem } from "../interfaces";

interface IChangeNumeralSystemOptions {
	target: NumeralSystem;
}

const DECIMAL_NUMBER_REGEX = /^\d+$/;
const HEXADECIMAL_NUMBER_REGEX = /^[0-9A-Fa-f]+$/;

export async function convertNumbers(options: IChangeNumeralSystemOptions) {
	const settings = getExtensionSettings();
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);
	const linesBySelection: string[][] = [];

	let hasInvalidNumbers = false;
	for (const selection of selections) {
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];

		for (const lineContent of getSelectionLines(editor, selection)) {
			let num;
			if (options.target === NumeralSystem.Decimal
				&& HEXADECIMAL_NUMBER_REGEX.test(lineContent)) {

				num = parseInt(lineContent, 16);
			} else if (options.target === NumeralSystem.Hexadecimal
				&& DECIMAL_NUMBER_REGEX.test(lineContent)) {

				num = parseInt(lineContent, 10);
			} else {
				if (lineContent !== "") {
					hasInvalidNumbers = true;
				}

				currentSelectionLines.push(lineContent);
				continue;
			}

			if (Number.isNaN(num)) {
				hasInvalidNumbers = true;
				currentSelectionLines.push(lineContent);
				continue;
			}

			let replacedContent = num.toString(options.target === NumeralSystem.Decimal ? 10 : 16);
			if (settings.insertUppercaseHexNumbers) {
				replacedContent = replacedContent.toLocaleUpperCase();
			}

			currentSelectionLines.push(replacedContent);
		}
	}

	if (hasInvalidNumbers) {
		vscode.window.showErrorMessage(
			"Not all selections or lines could be parsed as numbers. Do you want to convert the recognized lines?",
			"Yes",
			"No"
		).then(async (selected) => {
			if (selected === "Yes") {
				await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
			}
		}, () => {

		});
	} else {
		await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
	}
}
