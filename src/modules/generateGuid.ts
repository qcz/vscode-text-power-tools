import { v4 } from "node-uuid";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getPureSelections, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export enum  InsertNumbersNumberFormat {
	Decimal,
	Hex,
}

interface IGenerateGuidOptions {
	count: "single" | "multiple";
}

export async function generateGuid(options: IGenerateGuidOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	if (options.count === "multiple") {
		askForGuidCount(editor);
	} else {
		generateGuidInternal(editor, 1);
	}
}

export async function askForGuidCount(editor: vscode.TextEditor) {
	vscode.window.showInputBox({
		placeHolder: `Please enter how many GUIDs do you want to generate`,
		value: "1",
	}).then(async (rawGuidCount: string | undefined) => {
		if (typeof rawGuidCount === "undefined") {
			return;
		}

		if (!rawGuidCount) {
			vscode.window.showErrorMessage("No number entered.");
			return;
		}

		const guidCount = Number.parseInt(rawGuidCount, 10);
		if (isNaN(guidCount)) {
			vscode.window.showErrorMessage(`The entered text is not a valid number.`);
			return;
		}

		generateGuidInternal(editor, guidCount);
	});
}

export async function generateGuidInternal(editor: vscode.TextEditor, guidCount: number) {
	const settings = getExtensionSettings();
	const replacesBySelection: string[][] = [];
	const selections = getPureSelections(editor);

	for (const _ of selections) {
		replacesBySelection.push([]);

		for (let i = 0; i < guidCount; i++) {
			var guid = v4();
			replacesBySelection[replacesBySelection.length - 1].push(
				settings.insertUppercaseGuids ? guid.toUpperCase() : guid);
		}
	}

	await replaceSelectionsWithLines(editor, selections, replacesBySelection, false);
}
