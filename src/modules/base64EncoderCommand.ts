import { Base64 } from "js-base64";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionContent, getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum Base4EncodingDirection {
	Encode,
	Decode
}

interface IBase4EncodingOptions {
	direction: Base4EncodingDirection;
	onEachLine: boolean;
}

export async function runBase64EncodingCommand(options: IBase4EncodingOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);
	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];

		if (options.onEachLine === true) {
			for (const lineContent of getSelectionLines(editor, selection)) {
				if (options.direction === Base4EncodingDirection.Encode) {
					currentSelectionLines.push(Base64.encode(lineContent));
				} else {
					currentSelectionLines.push(Base64.decode(lineContent));
				}
			}
		} else {
			const selectionContent = getSelectionContent(editor, selection);

			if (options.direction === Base4EncodingDirection.Encode) {
				currentSelectionLines.push(Base64.encode(selectionContent));
			} else {
				currentSelectionLines.push(Base64.decode(selectionContent));
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
