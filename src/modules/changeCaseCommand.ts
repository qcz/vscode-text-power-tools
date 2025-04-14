import * as cc from "change-case";
import { sentenceCase } from "change-case";
import { spongeCase } from "sponge-case";
import { swapCase } from "swap-case";
import { titleCase } from "title-case";
import { camelCase } from "voca";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum ChangeCaseType {
	CamelCase,
	PascalCase,
	SnakeCase,
	DashCase,
	ConstantCase,
	DotCase ,
	TitleCase,
	SentenceCase,
	SpongeCase,
	SeparateWithSpaces,
	SeparateWithForwardSlashes,
	SeparateWithBackslashes,
	SwapCase,
}

interface IChangeCaseOptions {
	type: ChangeCaseType;
}

const CHANGE_CASE_OPTIONS: cc.Options = {
	splitRegexp: [
		/(\p{Ll}|\p{Lo}|\p{N})(\p{Lu}|\p{Lt})/gu, // one lower case char or digit followed by one upper case char
		/(\p{Lu}|\p{Lt})((?:\p{Lu}|\p{Lt})(?:\p{Ll}|\p{Lo}))/gu // one upper case char followed by one upper case char and then by one lower case char
	],
	stripRegexp: /[^\p{L}\d]+/giu
};

const PRESERVE_PUNCTUATIONS_CHANGE_CASE_OPTIONS: cc.Options = {
	...CHANGE_CASE_OPTIONS,
	stripRegexp: /[^\p{L}\p{P}\d]+/giu
};

export async function runChangeCaseCommand(options: IChangeCaseOptions) {
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
				case ChangeCaseType.CamelCase:
					currentSelectionLines.push(camelCase(lineContent));
					break;
				case ChangeCaseType.PascalCase:
					currentSelectionLines.push(cc.pascalCase(lineContent, CHANGE_CASE_OPTIONS));
					break;
				case ChangeCaseType.SnakeCase:
					currentSelectionLines.push(cc.snakeCase(lineContent, CHANGE_CASE_OPTIONS));
					break;
				case ChangeCaseType.DashCase:
					currentSelectionLines.push(cc.paramCase(lineContent, CHANGE_CASE_OPTIONS));
					break;
				case ChangeCaseType.ConstantCase:
					currentSelectionLines.push(cc.constantCase(lineContent, CHANGE_CASE_OPTIONS));
					break;
				case ChangeCaseType.DotCase:
					currentSelectionLines.push(cc.dotCase(lineContent, CHANGE_CASE_OPTIONS));
					break;
				case ChangeCaseType.SwapCase:
					currentSelectionLines.push(swapCase(lineContent));
					break;
				case ChangeCaseType.TitleCase:
					currentSelectionLines.push(titleCase(lineContent));
					break;
				case ChangeCaseType.SpongeCase:
					currentSelectionLines.push(spongeCase(lineContent));
					break;
				case ChangeCaseType.SentenceCase:
					currentSelectionLines.push(sentenceCase(lineContent, PRESERVE_PUNCTUATIONS_CHANGE_CASE_OPTIONS));
					break;
				case ChangeCaseType.SeparateWithSpaces:
					currentSelectionLines.push(cc.noCase(lineContent, {
						...CHANGE_CASE_OPTIONS,
						transform: (input: string) => input,
					}));
					break;
				case ChangeCaseType.SeparateWithForwardSlashes:
					currentSelectionLines.push(cc.pathCase(lineContent, {
						...CHANGE_CASE_OPTIONS,
						transform: (input: string) => input,
					}));
					break;
				case ChangeCaseType.SeparateWithBackslashes:
					currentSelectionLines.push(cc.pathCase(lineContent, {
						...CHANGE_CASE_OPTIONS,
						delimiter: "\\",
						transform: (input: string) => input,
					}));
					break;
				default:
					currentSelectionLines.push(lineContent);
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
