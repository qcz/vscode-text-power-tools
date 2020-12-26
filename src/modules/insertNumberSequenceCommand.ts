import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { insertSequenceInternal } from "../sequences/sequenceInserter";
import { NumeralSystem } from "../interfaces";
import { NumberSequece } from "../sequences/implementations/numberSequence";

interface InsertNumberSequenceOptions {
	numeralSystem: NumeralSystem;
	askForIncrements: boolean;
	askForStartingNumber: boolean;
}

export async function runInsertNumberSequenceCommand(options: InsertNumberSequenceOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	insertSequenceInternal(
		editor,
		await new NumberSequece(options.numeralSystem,
			options.askForStartingNumber ? undefined : 1,
			options.askForIncrements ? undefined : 1).createGenerator(false)
	);
}
