import * as vscode from "vscode";
import * as path from "path";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getPureSelections, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum InsertableStuff {
	FullFilePath,
	DirectoryPath,
	FileName,
	UnixTimestamp
}

interface InsertStuffOptions {
	what: InsertableStuff;
}

export async function runInsertStuffCommand(options: InsertStuffOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	let inserted: string = "";
	switch (options.what) {
		case InsertableStuff.FullFilePath:
			inserted = editor.document.fileName;
			break;
		case InsertableStuff.DirectoryPath:
			inserted = path.dirname(editor.document.fileName);
			break;
		case InsertableStuff.FileName:
			inserted = path.basename(editor.document.fileName);
			break;
		case InsertableStuff.UnixTimestamp:
			inserted = Math.floor((+Date.now()) / 1000).toString();
			break;
	}

	const replacesBySelection: string[][] = [];
	const selections = getPureSelections(editor);
	// eslint-disable-next-line no-unused-vars
	for (const _ of selections) {
		replacesBySelection.push([inserted]);
	}

	await replaceSelectionsWithLines(editor, selections, replacesBySelection, false);
}
