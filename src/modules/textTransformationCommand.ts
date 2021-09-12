import * as vscode from "vscode";
import v from "voca";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum TextTransformationType {
	RemoveWhitespace = 1,
	Json = 5,
	JsonString = 6,
	Latinize = 7,
	Slugify = 8,
}

interface ITransformTextOptions {
	type: TextTransformationType;
}

export async function runTextTransformationCommand(options: ITransformTextOptions) {
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

		for (const lineContent of getSelectionLines(editor, selection)) {
			switch (options.type) {
				case TextTransformationType.RemoveWhitespace:
					currentSelectionLines.push(lineContent.replace(/\s/g, ""));
					break;
				case TextTransformationType.Json:
					const stringified = JSON.stringify(lineContent);
					currentSelectionLines.push(stringified.substr(1, stringified.length - 2));
					break;
				case TextTransformationType.JsonString:
					currentSelectionLines.push(JSON.stringify(lineContent));
					break;
				case TextTransformationType.Latinize:
					currentSelectionLines.push(v.latinise(lineContent));
					break;
				case TextTransformationType.Slugify:
					currentSelectionLines.push(v.slugify(lineContent));
					break;
				default:
					currentSelectionLines.push(lineContent);
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
