import { decode as decodeEntities, encode as encodeEntities } from "html-entities";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionContent, getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum TextEncodingType {
	UrlEncoding = 1,
	HtmlEntityEncoding = 2,
	HtmlEntityEncodingWithNonAscii = 3,
	XmlEntityEncoding = 4,
	UnicodeEscapeSequences = 5,
	Json
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
				if (!runEncodingOnLine(options, currentSelectionLines, lineContent)) {
					return;
				}
			}
		} else {
			const selectionContent = getSelectionContent(editor, selection);

			if (!runEncodingOnLine(options, currentSelectionLines, selectionContent)) {
				return;
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
function runEncodingOnLine(options: IModifyTextEncodingOptions, currentSelectionLines: string[], lineContent: string): boolean {
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
		case TextEncodingType.UnicodeEscapeSequences:
			if (options.direction === TextEncodingDirection.Encode) {
				let result = "";
				for (let i = 0; i < lineContent.length; i++) {
					const escaped = "000" + lineContent[i].charCodeAt(0).toString(16);
					result += "\\u" + escaped.substring(escaped.length - 4);
				}
				currentSelectionLines.push(result);
			} else {
				const sourceJsonString = JSON.stringify(lineContent)
					.replace(/\\\\(u[0-9a-fA-F]{4})/g, "\\$1");
				const decodedContent = JSON.parse(sourceJsonString);
				currentSelectionLines.push(decodedContent);
			}

			break;
		case TextEncodingType.Json:
			if (options.direction === TextEncodingDirection.Encode) {
				const jsonifiedContent = JSON.stringify(lineContent);
				currentSelectionLines.push(jsonifiedContent.substring(1, jsonifiedContent.length - 2));
			} else {
				try {
					const deJsonifiedContent = JSON.parse(`"${lineContent}"`);
					if (typeof deJsonifiedContent === "string") {
						currentSelectionLines.push(deJsonifiedContent);
					} else {
						complainAboutJsonStringError(lineContent);
						return false;
					}
				} catch (err) {
					complainAboutJsonStringError(lineContent);
					return false;
				}
			}

			break;
		default:
			currentSelectionLines.push(lineContent);
	}

	return true;
}

function complainAboutJsonStringError(lineContent: string) {
	let lineStart;
	if (lineContent.length > 15) {
		lineStart = `The selection/line starting with \`${lineContent.substring(0, 15)}\``;
	} else {
		lineStart = `The selection/line \`${lineContent.substring(0, 15)}\``;
	}

	vscode.window.showErrorMessage(`${lineStart} is not a valid JSON escaped text`);
}

