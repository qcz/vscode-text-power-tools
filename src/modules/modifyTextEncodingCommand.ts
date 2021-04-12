import { AllHtmlEntities, XmlEntities } from "html-entities";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum TextEncodingType {
	UrlEncoding = 1,
	HtmlEntityEncoding = 2,
	HtmlEntityEncodingWithNonAscii = 3,
	XmlEntityEncoding = 4,
	Json = 5,
	JsonString = 6,
}

export const enum TextEncodingDirection {
	Encode,
	Decode
}

interface IModifyTextEncodingOptions {
	type: TextEncodingType;
	direction: TextEncodingDirection;
}

export async function runModifyTextEncodingCommand(options: IModifyTextEncodingOptions) {
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
				case TextEncodingType.UrlEncoding:
					if (options.direction === TextEncodingDirection.Encode) {
						currentSelectionLines.push(encodeURIComponent(lineContent));
					} else {
						currentSelectionLines.push(decodeURIComponent(lineContent));
					}
					break;
				case TextEncodingType.HtmlEntityEncoding:
					if (options.direction === TextEncodingDirection.Encode) {
						currentSelectionLines.push(AllHtmlEntities.encode(lineContent));
					} else {
						currentSelectionLines.push(AllHtmlEntities.decode(lineContent));
					}
					break;
				case TextEncodingType.HtmlEntityEncoding:
					if (options.direction === TextEncodingDirection.Encode) {
						currentSelectionLines.push(AllHtmlEntities.encodeNonUTF(lineContent));
					} else {
						currentSelectionLines.push(AllHtmlEntities.decode(lineContent));
					}
					break;
				case TextEncodingType.XmlEntityEncoding:
					if (options.direction === TextEncodingDirection.Encode) {
						currentSelectionLines.push(XmlEntities.encode(lineContent));
					} else {
						currentSelectionLines.push(XmlEntities.decode(lineContent));
					}
					break;
				case TextEncodingType.Json:
					if (options.direction === TextEncodingDirection.Encode) {
						currentSelectionLines.push(JSON.stringify(lineContent).substr(1, lineContent.length));
					} else {
						// Reverse not supported for now
					}
					break;
				case TextEncodingType.JsonString:
					if (options.direction === TextEncodingDirection.Encode) {
						currentSelectionLines.push(JSON.stringify(lineContent));
					} else {
						// Reverse not supported for now
					}
					break;
				default:
					currentSelectionLines.push(lineContent);
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
