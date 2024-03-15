import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getPureSelections, getSelectionLines, replaceSelectionsWithLines, sortSelectionsByPosition } from "../helpers/vsCodeHelpers";

export enum  PadDirection {
	Start,
	End,
}

interface PadOptions {
	direction: PadDirection;
	askForPadCharacters: boolean;
}

export async function runPadCommand(options: PadOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	askForPadLength(editor, options);
}

export async function askForPadLength(editor: vscode.TextEditor, options: PadOptions) {
	vscode.window.showInputBox({
		prompt: vscode.l10n.t("Please enter the length of the padded string"),
	}).then(async (rawPadLength: string | undefined) => {
		if (typeof rawPadLength === "undefined") {
			return;
		}

		if (!rawPadLength) {
			vscode.window.showErrorMessage(vscode.l10n.t("No pad length entered."));
			return;
		}

		const padLength = Number.parseInt(rawPadLength, 10);
		if (isNaN(padLength)) {
			vscode.window.showErrorMessage(vscode.l10n.t("The entered pad length is not a valid number."));
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
		prompt: vscode.l10n.t("Please enter the string used for padding"),
	}).then(async (padString: string | undefined) => {
		if (typeof padString === "undefined") {
			return;
		}

		if (!padString) {
			vscode.window.showErrorMessage(vscode.l10n.t("No pad string entered."));
			return;
		}

		padInternal(editor, options.direction, padLength, padString);
	});
}

export async function padInternal(editor: vscode.TextEditor, direction: PadDirection, padLength: number, padString?: string) {
	const settings = getExtensionSettings();
	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);

	const fillString = padString || settings.defaultPadString || " ";
	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];

		for (const lineContent of getSelectionLines(editor, selection)) {
			if (direction === PadDirection.Start) {
				currentSelectionLines.push(lineContent.padStart(padLength, fillString));
			} else {
				currentSelectionLines.push(lineContent.padEnd(padLength, fillString));
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
