import * as vscode from "vscode";
import { CANNOT_SELECT_MORE_THAN_ONE_LINE, NOTHING_IS_SELECTED, NO_ACTIVE_EDITOR, SELECT_MORE_THAN_ONE_LINE } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getFullDocumentRange, getSelectionContent, getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines, showHistoryQuickPick } from "../helpers/vsCodeHelpers";

export enum FilterType {
	Include,
	Exclude
}

export enum FilterSourceType {
	String,
	Regex,
	Selection,
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

export async function runFilterTextCommand(context: vscode.ExtensionContext, options: IFilterTextCommandOptions) {
	const { sourceType } = options;

	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	if (sourceType === FilterSourceType.Selection) {
		if (editor.selection.isEmpty) {
			vscode.window.showErrorMessage(NOTHING_IS_SELECTED);
			return;
		}

		if (editor.selection.isSingleLine === false) {
			vscode.window.showErrorMessage(CANNOT_SELECT_MORE_THAN_ONE_LINE);
			return;
		}

		const selectionContent = getSelectionContent(editor, editor.selection);
		await doFilter(editor, selectionContent, options);
	} else {
		if (editor.selections.length === 1 && editor.selection.isSingleLine && editor.selection.isEmpty === false) {
			vscode.window.showErrorMessage(SELECT_MORE_THAN_ONE_LINE);
			return;
		}

		showHistoryQuickPick({
			context: context,
			title: sourceType === FilterSourceType.String
				? vscode.l10n.t("Please enter the filter text")
				: vscode.l10n.t("Please enter the filter regular expression"),
			historyStateKey: "filterText-" + sourceType.toString(),
			onDidAccept: async (filter: string) => {
				if (!filter) {
					return;
				}

				await doFilter(editor, filter, options);
			}
		});
	}
}
async function doFilter(editor: vscode.TextEditor, filter: string, options: IFilterTextCommandOptions): Promise<void> {
	const { filterType, sourceType, target } = options;
	const { caseSensitiveFiltering } = getExtensionSettings();

	if (caseSensitiveFiltering === false) {
		filter = filter.toLocaleLowerCase();
	}

	const regexObject = sourceType === FilterSourceType.Regex ? new RegExp(filter, caseSensitiveFiltering === false ? "i" : undefined) : new RegExp("");
	const isTargetingClipboard = target === FilterTarget.CutToClipboard || target === FilterTarget.CopyToClipboard;

	const matchingLinesBySelection: string[][] = [];
	let clipboardContent = "";
	const selections = options.sourceType === FilterSourceType.Selection
		? [getFullDocumentRange(editor)]
		: getSelectionsOrFullDocument(editor);

	for (const selection of selections) {
		matchingLinesBySelection.push([]);

		for (const lineContent of getSelectionLines(editor, selection)) {
			let matched: boolean = false;
			if (sourceType === FilterSourceType.String || sourceType === FilterSourceType.Selection) {
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
			target === FilterTarget.NewEditor
		);

		if (sourceType === FilterSourceType.Selection) {
			editor.selections = [];
		}
	}
}

