import * as vscode from "vscode";
import { replaceLinesOfSelections, getSelections, getSelectionLines } from "../helpers/vsCodeHelpers";
import { getExtensionSettings } from "../helpers/tptSettings";

export enum FilterType {
	Include,
	Exclude
}

export enum FilterSourceType {
	String,
	Regex
}

export interface FilterTextCommandOptions {
	type: FilterType;
	sourceType: FilterSourceType;
	inNewEditor: boolean;
}

export async function filterText(options: FilterTextCommandOptions) {
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

		const regexObject = options.sourceType === FilterSourceType.Regex ? new RegExp(filter, settings.caseSensitiveFiltering === false ? "i" : undefined) : new RegExp("");

		const matchingLinesBySelection: string[][] = [];
		const selections = getSelections(editor);
		
		for (const selection of selections) {
			matchingLinesBySelection.push([]);

			for (const lineContent of getSelectionLines(editor, selection)) {
				let matched: boolean = false;
				if (options.sourceType === FilterSourceType.String) {
					matched = (settings.caseSensitiveFiltering ? lineContent : lineContent.toLocaleLowerCase()).indexOf(filter) !== -1;
				} else {
					matched = regexObject.test(lineContent);
				}

				if (options.type === FilterType.Exclude) {
					matched = !matched;
				}

				if (matched) {
					matchingLinesBySelection[matchingLinesBySelection.length - 1].push(lineContent);
				}
			}
		}

		await replaceLinesOfSelections(editor, selections, matchingLinesBySelection, options.inNewEditor);
	}, (reason) => {
		vscode.window.showErrorMessage("Error while processing the request.");
	});
}
