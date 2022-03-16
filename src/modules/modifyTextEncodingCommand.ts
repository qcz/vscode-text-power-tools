import { decode as decodeEntities, encode as encodeEntities } from "html-entities";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionContent, getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum TextEncodingType {
	UrlEncoding = 1,
	HtmlEntityEncoding = 2,
	HtmlEntityEncodingWithNonAscii = 3,
	XmlEntityEncoding = 4,
}

export const enum TextEncodingDirection {
	Encode,
	Decode
}

interface IModifyTextEncodingOptions {
	type: TextEncodingType;
	direction: TextEncodingDirection;
	onEachLine: boolean;
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

		if (options.onEachLine === true) {
			for (const lineContent of getSelectionLines(editor, selection)) {
				runEncodingOnLine(options, currentSelectionLines, lineContent);
			}
		} else {
			const selectionContent = getSelectionContent(editor, selection);

			runEncodingOnLine(options, currentSelectionLines, selectionContent);
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
function runEncodingOnLine(options: IModifyTextEncodingOptions, currentSelectionLines: string[], lineContent: string) {
	switch (options.type) {
		case TextEncodingType.UrlEncoding:
			if (options.direction === TextEncodingDirection.Encode) {
				currentSelectionLines.push(encodeURIComponent(lineContent).replace(/\n/g, "%0A"));
			} else {
				currentSelectionLines.push(decodeURIComponent(lineContent));
			}
			break;
		case TextEncodingType.HtmlEntityEncoding:
			if (options.direction === TextEncodingDirection.Encode) {
				currentSelectionLines.push(encodeEntities(lineContent, {
					level: "html5",
					mode: "specialChars"
				}).replace(/\n/g, "&#13;"));
			} else {
				currentSelectionLines.push(decodeEntities(lineContent, { level: "html5" }).replace(/&#13;/g, "\n"));
			}
			break;
		case TextEncodingType.HtmlEntityEncodingWithNonAscii:
			if (options.direction === TextEncodingDirection.Encode) {
				currentSelectionLines.push(encodeEntities(lineContent, {
					level: "html5",
					mode: "nonAsciiPrintable"
				}).replace(/\n/g, "&#13;"));
			} else {
				currentSelectionLines.push(decodeEntities(lineContent, { level: "html5" }).replace(/&#13;/g, "\n"));
			}
			break;
		case TextEncodingType.XmlEntityEncoding:
			if (options.direction === TextEncodingDirection.Encode) {
				currentSelectionLines.push(encodeEntities(lineContent, {
					level: "xml"
				}).replace(/\n/g, "&#13;"));
			} else {
				currentSelectionLines.push(decodeEntities(lineContent, {level: "xml" }).replace(/&#13;/g, "\n"));
			}
			break;
		default:
			currentSelectionLines.push(lineContent);
	}
}

