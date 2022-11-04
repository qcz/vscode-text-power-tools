import * as cc from "change-case";
import { noCase, pathCase } from "change-case";
import { spongeCase } from "sponge-case";
import { swapCase } from "swap-case";
import { titleCase } from "title-case";
import { camelCase } from "voca";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum ChangeCaseType {
	CamelCase = 1,
	PascalCase = 2,
	SnakeCase = 3,
	DashCase = 4,
	ConstantCase = 5,
	DotCase = 6,
	TitleCase = 7,
	SpongeCase = 8,
	SeparateWithSpaces = 9,
	SeparateWithForwardSlashes = 10,
	SeparateWithBackslashes = 11,
	SwapCase = 100,
}

interface IChangeCaseOptions {
	type: ChangeCaseType;
}

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
					currentSelectionLines.push(cc.pascalCase(lineContent));
					break;
				case ChangeCaseType.SnakeCase:
					currentSelectionLines.push(cc.snakeCase(lineContent));
					break;
				case ChangeCaseType.DashCase:
					currentSelectionLines.push(cc.paramCase(lineContent));
					break;
				case ChangeCaseType.ConstantCase:
					currentSelectionLines.push(cc.constantCase(lineContent));
					break;
				case ChangeCaseType.DotCase:
					currentSelectionLines.push(cc.dotCase(lineContent));
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
				case ChangeCaseType.SeparateWithSpaces:
					currentSelectionLines.push(noCase(lineContent, {
						transform: (input: string) => input
					}));
					break;
				case ChangeCaseType.SeparateWithForwardSlashes:
					currentSelectionLines.push(pathCase(lineContent, {
						transform: (input: string) => input
					}));
					break;
				case ChangeCaseType.SeparateWithBackslashes:
					currentSelectionLines.push(pathCase(lineContent, {
						delimiter: "\\",
						transform: (input: string) => input
					}));
					break;
				default:
					currentSelectionLines.push(lineContent);
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
