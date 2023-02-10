import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export enum  ClipboardContentPasteType {
	Spread,
	SpreadRepeatedly,
}

interface IInsertFromClipboardCommandOptions {
	type: ClipboardContentPasteType;
	skipEmpty: boolean;
}

export async function runPasteFromClipboardCommand(options: IInsertFromClipboardCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const replacedLinesBySelection: string[][] = [];
	const selections = getSelectionsOrFullDocument(editor);

	const clipboardContent = await vscode.env.clipboard.readText();
	if (clipboardContent.length === 0) {
		return;
	}

	const lines = clipboardContent.split(/\r?\n|\r|\n/g);

	if (options.skipEmpty && lines.every(x => x === "")) {
		return;
	}

	let linesIndex = -1;
	for (let i = 0; i < selections.length; i++) {
		if (options.skipEmpty) {
			do {
				linesIndex++;

				if (options.type === ClipboardContentPasteType.Spread && linesIndex >= lines.length) {
					break;
				}
			}
			while (lines[linesIndex % lines.length] === "");
		} else {
			linesIndex++;
		}

		if (options.type === ClipboardContentPasteType.Spread && linesIndex >= lines.length) {
			break;
		}

		replacedLinesBySelection.push([
			lines[linesIndex % lines.length]
		]);
	}

	await replaceSelectionsWithLines(editor, selections.slice(0, replacedLinesBySelection.length), replacedLinesBySelection, /*openInNewEditor:*/ false);
}
