import * as path from "path";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getPureSelections, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum InsertableStuff {
	FullFilePath,
	DirectoryPath,
	FileName,
	Date,
	DateLocal,
	Time,
	TimeLocal,
	Timestamp,
	TimestampLocal,
	UtcTimestamp,
	UnixTimestamp,
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

	const settings = getExtensionSettings();
	let customLocale = vscode.env.language;
	if (settings.customLocale != null && settings.customLocale !== "") {
		customLocale = settings.customLocale;
	}

	let inserted: string = customLocale;
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
		case InsertableStuff.Date:
			inserted = new Date().toLocaleDateString("en-US");
			break;
		case InsertableStuff.DateLocal:
			inserted = new Date().toLocaleDateString(customLocale);
			break;
		case InsertableStuff.Time:
			inserted = new Date().toLocaleTimeString("en-US");
			break;
		case InsertableStuff.TimeLocal:
			inserted = new Date().toLocaleTimeString(customLocale);
			break;
		case InsertableStuff.Timestamp:
			inserted = new Date().toLocaleString("en-US");
			break;
		case InsertableStuff.TimestampLocal:
			inserted = new Date().toLocaleString(customLocale);
			break;
		case InsertableStuff.UtcTimestamp:
			inserted = new Date().toISOString();
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
