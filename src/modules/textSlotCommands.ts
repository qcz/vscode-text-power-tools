import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getPureSelections, getSelectionContent, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

interface ITextSlotCommandOptions {
	slotId: 1 | 2 | 3 | 4 | 5;
}

export async function runpasteTextSlotCommand(context: vscode.ExtensionContext, options: ITextSlotCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	pasteTextSlotCommandInternal(context, editor, options);
}

export async function pasteTextSlotCommandInternal(context: vscode.ExtensionContext, editor: vscode.TextEditor, options: ITextSlotCommandOptions) {
	let slotContent = context.globalState.get<string>(`textSlot${options.slotId}-content`, "");
	if (!slotContent) {
		vscode.window.showWarningMessage(vscode.l10n.t(
			"Text slot {0} is empty. Use the 'Set text slot {0} content' to configure it.",
			options.slotId
		));
		return;
	}

	const replacesBySelection: string[][] = [];

	const selections = getPureSelections(editor);

	// eslint-disable-next-line no-unused-vars
	for (const _ of selections) {
		replacesBySelection.push([]);
		replacesBySelection[replacesBySelection.length - 1].push(slotContent);
	}

	const isSingleEmptySelection = selections.length === 1
		&& editor.selection.isEmpty;

	await replaceSelectionsWithLines(editor, selections, replacesBySelection, false);

	if (isSingleEmptySelection && /[\r\n]/.test(slotContent) === false) {
		editor.selection = new vscode.Selection(
			editor.selection.end.line,
			editor.selection.end.character + slotContent.length,
			editor.selection.end.line,
			editor.selection.end.character + slotContent.length,
		);
	}
}

export async function runSetTextSlotContentCommand(context: vscode.ExtensionContext, options: ITextSlotCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	setTextSlotCommandInternal(context, editor, options);
}

export async function setTextSlotCommandInternal(context: vscode.ExtensionContext, editor: vscode.TextEditor, options: ITextSlotCommandOptions) {
	const selections = getPureSelections(editor);
	if (selections.length === 0) {
		vscode.window.showWarningMessage(vscode.l10n.t("You need to select some text in the active editor to set the content of a text slot."));
		return;
	}

	context.globalState.update(
		`textSlot${options.slotId}-content`,
		getSelectionContent(editor, selections[0])
	);

	vscode.window.showInformationMessage(vscode.l10n.t("Text slot {0} content updated from selection.", options.slotId));
}
