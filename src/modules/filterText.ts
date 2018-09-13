import * as vscode from "vscode";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getSelectionLines, getSelections, replaceLinesOfSelections, showHistoryQuickPick } from "../helpers/vsCodeHelpers";

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

export async function filterText(context: vscode.ExtensionContext, options: FilterTextCommandOptions) {
	const settings = getExtensionSettings();

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		console.log(vscode.window.visibleTextEditors);
		vscode.window.showErrorMessage("Please open an editor to use this function.");
		return;
	}

	showHistoryQuickPick({
		context: context,
		placeholder: options.sourceType === FilterSourceType.String
			? "Please enter the filter text"
			: "Please enter the filter regular expression",
		historyStateKey: "filterText-" + options.sourceType.toString(),
		onDidAccept: async (filter: string) => {
			if (!filter) {
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
		}
	});
}
