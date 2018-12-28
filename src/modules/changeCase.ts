import * as cc from "change-case";
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
	SwapCase = 100,
}

interface IChangeCaseOptions {
	type: ChangeCaseType;
}

export async function changeCase(options: IChangeCaseOptions) {
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
					currentSelectionLines.push(cc.camelCase(lineContent, /*locale:*/ undefined, /*mergeNumbers:*/ true));
					break;
				case ChangeCaseType.PascalCase:
					currentSelectionLines.push(cc.pascalCase(lineContent, /*locale:*/ undefined, /*mergeNumbers:*/ true));
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
					currentSelectionLines.push(cc.swapCase(lineContent));
					break;
				default:
					currentSelectionLines.push(lineContent);
			}
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
