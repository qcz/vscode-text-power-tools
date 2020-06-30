import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export enum  LineNumberType {
	Real,
	Relative,
}

interface IInsertLineNumberCommandOptions {
	type: LineNumberType;
	padWithZero: boolean;
}

export async function runInsertLineNumbersCommand(options: IInsertLineNumberCommandOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		console.log(vscode.window.visibleTextEditors);
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const replacedLinesBySelection: string[][] = [];
	const selections = getSelectionsOrFullDocument(editor);
	
	let lineMax = 0;
	let lineDiffMax = 0;
	for (const selection of selections) {
		if (selection.end.line > lineMax) {
			lineMax = selection.end.line + 1;
		}

		const diff = selection.end.line - selection.start.line;
		if (diff > lineDiffMax) {
			lineDiffMax = diff;
		}
	}

	var padLength = (options.type === LineNumberType.Real ? lineMax : lineDiffMax).toString().length;

	for (const selection of selections) {
		replacedLinesBySelection.push([]);

		let currentLineNumber = options.type === LineNumberType.Real
			? selection.start.line + 1
			: 1;

		for (const lineContent of getSelectionLines(editor, selection)) {
			const lineNumberString = options.padWithZero
				? currentLineNumber.toString().padStart(padLength, "0")
				: currentLineNumber.toString();

			replacedLinesBySelection[replacedLinesBySelection.length - 1].push(lineNumberString + " " + lineContent);
			currentLineNumber++;
		}
	}

	await replaceSelectionsWithLines(editor, selections, replacedLinesBySelection, /*openInNewEditor:*/ false);
}
