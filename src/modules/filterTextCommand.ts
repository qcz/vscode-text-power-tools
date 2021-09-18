import * as vscode from "vscode";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines, showHistoryQuickPick } from "../helpers/vsCodeHelpers";
import { NO_ACTIVE_EDITOR } from "../consts";

export enum FilterType {
	Include,
	Exclude
}

export enum FilterSourceType {
	String,
	Regex
}

export enum FilterTarget {
	CurrentEditor,
	NewEditor,
	CopyToClipboard,
	CutToClipboard
}

interface IFilterTextCommandOptions {
	filterType: FilterType;
	sourceType: FilterSourceType;
	target: FilterTarget;
}

export async function runFilterTextCommand(context: vscode.ExtensionContext, options2: IFilterTextCommandOptions) {
	const { caseSensitiveFiltering } = getExtensionSettings();
	const { filterType, sourceType, target } = options2;

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		console.log(vscode.window.visibleTextEditors);
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	showHistoryQuickPick({
		context: context,
		title: sourceType === FilterSourceType.String
			? "Please enter the filter text"
			: "Please enter the filter regular expression",
		historyStateKey: "filterText-" + sourceType.toString(),
		onDidAccept: async (filter: string) => {
			if (!filter) {
				return;
			}

			if (caseSensitiveFiltering === false) {
				filter = filter.toLocaleLowerCase();
			}

			const regexObject = sourceType === FilterSourceType.Regex ? new RegExp(filter, caseSensitiveFiltering === false ? "i" : undefined) : new RegExp("");
			const isTargetingClipboard = target === FilterTarget.CutToClipboard || target === FilterTarget.CopyToClipboard;

			const matchingLinesBySelection: string[][] = [];
			let clipboardContent = "";
			const selections = getSelectionsOrFullDocument(editor);

			for (const selection of selections) {
				matchingLinesBySelection.push([]);

				for (const lineContent of getSelectionLines(editor, selection)) {
					let matched: boolean = false;
					if (sourceType === FilterSourceType.String) {
						matched = (caseSensitiveFiltering ? lineContent : lineContent.toLocaleLowerCase()).indexOf(filter) !== -1;
					} else {
						matched = regexObject.test(lineContent);
					}

					if (filterType === FilterType.Exclude) {
						matched = !matched;
					}

					if (matched && isTargetingClipboard) {
						if (clipboardContent.length > 0) {
							clipboardContent += "\n";
						}
						clipboardContent += lineContent;
					}

					if (target === FilterTarget.CutToClipboard) {
						if (!matched) {
							matchingLinesBySelection[matchingLinesBySelection.length - 1].push(lineContent);
						}
					} else if (matched) {
						matchingLinesBySelection[matchingLinesBySelection.length - 1].push(lineContent);
					}
				}
			}

			if (isTargetingClipboard) {
				vscode.env.clipboard.writeText(clipboardContent);
			}

			if (target !== FilterTarget.CopyToClipboard) {
				await replaceSelectionsWithLines(editor,
					selections,
					matchingLinesBySelection,
					target === FilterTarget.NewEditor);
			}
		}
	});
}
