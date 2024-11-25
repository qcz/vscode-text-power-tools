import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { NumeralSystem } from "../interfaces";
import { insertSequenceInternal } from "../sequences/sequenceInserter";
import { isSequenceErrorMessage } from "../sequences/sequenceTypes";
import { NumberSequece } from "../sequences/standardSequences/numberSequence";

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

	const generatorResult = await new NumberSequece({
		numeralSystem: options.numeralSystem,
		startingNumber: options.askForStartingNumber ? undefined : 1,
		increment: options.askForIncrements ? undefined : 1
	}).createGenerator();

	if (isSequenceErrorMessage(generatorResult)) {
		vscode.window.showErrorMessage(generatorResult.errorMessage);
		return;
	}

	insertSequenceInternal(
		editor,
		generatorResult
	);
}
