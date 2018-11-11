import * as vscode from "vscode";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getSelectionLines, getSelectionsOrFullDocument, replaceLinesOfSelections, showHistoryQuickPick } from "../helpers/vsCodeHelpers";
import { NO_ACTIVE_EDITOR } from "../consts";

export enum FilterType {
	Include,
	Exclude
}

export enum FilterSourceType {
	String,
	Regex
}

interface IFilterTextCommandOptions {
	type: FilterType;
	sourceType: FilterSourceType;
	inNewEditor: boolean;
}

export async function filterText(context: vscode.ExtensionContext, options: IFilterTextCommandOptions) {
	const settings = getExtensionSettings();

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		console.log(vscode.window.visibleTextEditors);
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
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
			const selections = getSelectionsOrFullDocument(editor);
			
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
