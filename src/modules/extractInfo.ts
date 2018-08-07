import * as vscode from "vscode";
import { replaceLinesOfSelections, getSelections, getSelectionLines } from "../helpers/vsCodeHelpers";
import { getExtensionSettings } from "../helpers/tptSettings";

export interface ExtractInfoCommandOptions {
	inNewEditor: boolean;
}

export async function extractInfo(options: ExtractInfoCommandOptions) {
	const settings = getExtensionSettings();
	let filterString: string = "";

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage("Please open an editor to use this function.");
		return;
	}

	vscode.window.showInputBox({
		placeHolder: "Please enter the filter text",
		value: filterString,
	}).then(async (filter: string | undefined) => {
		if (typeof filter === "undefined") {
			return;
		}

		if (!filter) {
			vscode.window.showErrorMessage("No filter text entered.");
			return;
		}

		if (settings.caseSensitiveFiltering === false) {
			filter = filter.toLocaleLowerCase();
		}

		const regexObject = new RegExp("^.*?" + filter + ".*?$", settings.caseSensitiveFiltering === false ? "i" : undefined);

		vscode.window.showInputBox({
			placeHolder: "Please enter the replacement rule",
			value: filterString,
		}).then(async (replacement: string | undefined) => {
			if (typeof replacement === "undefined") {
				return;
			}
	
			if (!replacement) {
				vscode.window.showErrorMessage("No replacement entered.");
				return;
			}

			const matchingLinesBySelection: string[][] = [];
			const selections = getSelections(editor);
			
			for (const selection of selections) {
				matchingLinesBySelection.push([]);

				for (const lineContent of getSelectionLines(editor, selection)) {
					let matched: boolean = regexObject.test(lineContent);

					if (matched) {
						matchingLinesBySelection[matchingLinesBySelection.length - 1].push(lineContent.replace(regexObject, replacement));
					}
				}
			}

			await replaceLinesOfSelections(editor, selections, matchingLinesBySelection, options.inNewEditor);
		}, (reason) => {
			vscode.window.showErrorMessage("Error while processing the request.");
		});
	}, (reason) => {
		vscode.window.showErrorMessage("Error while processing the request.");
	});
}
