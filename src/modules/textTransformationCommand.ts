import v from "voca";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum TextTransformationType {
	RemoveWhitespace = 1,
	Reverse = 2,
	JsonString = 6,
	Latinize = 7,
	Slugify = 8,
	UnicodeNormalizationNFC = 9,
	UnicodeNormalizationNFD = 10,
	UnicodeNormalizationNFKC = 11,
	UnicodeNormalizationNFKD = 12,
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
				case TextTransformationType.Reverse:
					currentSelectionLines.push(v.reverse(lineContent));
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
				case TextTransformationType.UnicodeNormalizationNFC:
					currentSelectionLines.push(lineContent.normalize("NFC"));
					break;
				case TextTransformationType.UnicodeNormalizationNFD:
					currentSelectionLines.push(lineContent.normalize("NFD"));
					break;
				case TextTransformationType.UnicodeNormalizationNFKC:
					currentSelectionLines.push(lineContent.normalize("NFKC"));
					break;
				case TextTransformationType.UnicodeNormalizationNFKD:
					currentSelectionLines.push(lineContent.normalize("NFKD"));
					break;
				default:
					currentSelectionLines.push(lineContent);
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
