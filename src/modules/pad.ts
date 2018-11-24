import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getPureSelections, getSelectionContent, replaceLinesOfSelections, sortSelectionsByPosition } from "../helpers/vsCodeHelpers";

export enum  PadDirection {
	Start,
	End,
}

interface PadOptions {
	direction: PadDirection;
	askForPadCharacters: boolean;
}

export async function pad(options: PadOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	askForPadLength(editor, options);
}

export async function askForPadLength(editor: vscode.TextEditor, options: PadOptions) {
	vscode.window.showInputBox({
		placeHolder: `Please enter the length of the padded string`,
	}).then(async (rawPadLength: string | undefined) => {
		if (typeof rawPadLength === "undefined") {
			return;
		}

		if (!rawPadLength) {
			vscode.window.showErrorMessage("No pad length entered.");
			return;
		}

		const padLength = Number.parseInt(rawPadLength, 10);
		if (isNaN(padLength)) {
			vscode.window.showErrorMessage(`The entered pad length is not a valid number.`);
			return;
		}

		if (options.askForPadCharacters) {
			askForPadCharacter(editor, options, padLength);
		} else {
			padInternal(editor, options.direction, padLength);
		}
	});
}

export async function askForPadCharacter(editor: vscode.TextEditor, options: PadOptions, padLength: number) {
	vscode.window.showInputBox({
		placeHolder: `Please enter the string used for padding`,
	}).then(async (padString: string | undefined) => {
		if (typeof padString === "undefined") {
			return;
		}

		if (!padString) {
			vscode.window.showErrorMessage("No pad string entered.");
			return;
		}

		padInternal(editor, options.direction, padLength, padString);
	});
}

export async function padInternal(editor: vscode.TextEditor, direction: PadDirection, padLength: number, padString?: string) {
	const settings = getExtensionSettings();
	const replacesBySelection: string[][] = [];
	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);

	const fillString = padString || settings.defaultPadString || " ";
	
	for (let i = 0, len = selections.length; i < len; i++) {
		const selectionContent = getSelectionContent(editor, selections[i]);
		if (direction === PadDirection.Start) {
			replacesBySelection.push([selectionContent.padStart(padLength, fillString)]);
		} else {
			replacesBySelection.push([selectionContent.padEnd(padLength, fillString)]);
		}
	}

	await replaceLinesOfSelections(editor, selections, replacesBySelection, false);
}
