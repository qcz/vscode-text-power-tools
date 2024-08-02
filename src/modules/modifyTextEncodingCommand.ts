import { decode as decodeEntities, encode as encodeEntities } from "html-entities";
import * as tr46 from "tr46";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionContent, getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum TextEncodingType {
	UrlEncoding,
	HtmlEntityEncoding,
	HtmlEntityEncodingWithNonAscii,
	HtmlEntityEncodingAllNamedReferences,
	XmlEntityEncoding,
	UnicodeEscapeSequences,
	PunycodeDomainName,
	Json,
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
		case TextEncodingType.HtmlEntityEncodingAllNamedReferences:
			if (options.direction === TextEncodingDirection.Encode) {
				currentSelectionLines.push(encodeEntities(lineContent, {
					level: "html5",
					mode: "extensive"
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
		case TextEncodingType.PunycodeDomainName:
			if (options.direction === TextEncodingDirection.Encode) {
				currentSelectionLines.push(tr46.toASCII(lineContent, {
					transitionalProcessing: !lineContent.match(
						/\.(?:art|be|ca|de|swiss|fr|pm|re|tf|wf|yt)\.?$/
					),
				}));
			} else {
				const result = tr46.toUnicode(lineContent, {
					transitionalProcessing: !lineContent.match(
						/\.(?:art|be|ca|de|swiss|fr|pm|re|tf|wf|yt)\.?$/
					)
				// tr46 ts typing is not accurate
				}) as unknown as { error: boolean; domain: string; };

				if (result != null && !result.error) {
					currentSelectionLines.push(result.domain);
				} else {
					complainAboutInvalidPunycodeDomain(lineContent);
				}
			}
			break;
		case TextEncodingType.Json:
			if (options.direction === TextEncodingDirection.Encode) {
				const jsonifiedContent = JSON.stringify(lineContent);
				currentSelectionLines.push(jsonifiedContent.substring(1, jsonifiedContent.length - 1));
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

function complainAboutInvalidPunycodeDomain(lineContent: string) {
	let errorMessage;
	if (lineContent.length > 15) {
		errorMessage = vscode.l10n.t(
			"Failed to convert punycode encoded domain `{0}` back to Unicode",
			lineContent.substring(0, 15)
		);
	} else {
		errorMessage = vscode.l10n.t(
			"Failed to convert punycode encoded domain `{0}` back to Unicode",
			lineContent
		);
	}

	vscode.window.showErrorMessage(errorMessage);
}



function complainAboutJsonStringError(lineContent: string) {
	let errorMessage;
	if (lineContent.length > 15) {
		errorMessage = vscode.l10n.t(
			"The selection/line starting with `{0}` is not a valid JSON escaped text",
			lineContent.substring(0, 15)
		);
	} else {
		errorMessage = vscode.l10n.t(
			"The selection/line `{0}` is not a valid JSON escaped text",
			lineContent
		);
	}

	vscode.window.showErrorMessage(errorMessage);
}

