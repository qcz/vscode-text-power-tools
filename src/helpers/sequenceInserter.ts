import * as vscode from "vscode";
import { getPureSelections, replaceSelectionsWithLines, sortSelectionsByPosition } from "./vsCodeHelpers";

export async function insertSequenceInternal(
	editor: vscode.TextEditor,
	generator: () => IterableIterator<string>
) {
	const selections = getPureSelections(editor);

	if (selections.length === 1) {
		askForNumberOfSequenceEntriesToInsert(
			editor,
			generator
		);
	} else {
		await insertSequenceForRealThisTime(
			editor,
			generator,
			1
		);
	}
}

async function askForNumberOfSequenceEntriesToInsert(
	editor: vscode.TextEditor,
	generator: () => IterableIterator<string>)
{
	vscode.window.showInputBox({
		placeHolder: `Please specify the number of items to insert.`,
		value: "1",
	}).then(async (rawNumberOfItemsToInsert: string | undefined) => {
		if (typeof rawNumberOfItemsToInsert === "undefined") {
			return;
		}

		if (!rawNumberOfItemsToInsert) {
			vscode.window.showErrorMessage("No number of items to insert entered.");
			return;
		}

		const numberOfItemsToInsert = Number.parseInt(rawNumberOfItemsToInsert, 10);
		if (isNaN(numberOfItemsToInsert)) {
			vscode.window.showErrorMessage(`The entered number of items to insert is not a valid number.`);
			return;
		}

		insertSequenceForRealThisTime(
			editor,
			generator,
			numberOfItemsToInsert
		);
	});
}

async function insertSequenceForRealThisTime(
	editor: vscode.TextEditor,
	generator: () => IterableIterator<string>,
	numberOfItemsToInsertPerSelection: number)
{
	const replacesBySelection: string[][] = [];
	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);
	
	let iterator = generator();
	for (let i = 0, len = selections.length; i < len; i++) {

		const selectionReplacement: string[] = [];
		for (let itemBySelCounter = 0; itemBySelCounter < numberOfItemsToInsertPerSelection; itemBySelCounter ++) {
			let iteratorValue = iterator.next();

			if (iteratorValue.done) {
				// Restart sequence generator
				iterator = generator();
				iteratorValue = iterator.next();
			}

			if (typeof iteratorValue.value !== "string") {
				vscode.window.showErrorMessage("Error while running sequence generator. "
					+ "Please contact extension maintainer on GitHub.");
				return;
			}

			selectionReplacement.push(iteratorValue.value);
		}

		replacesBySelection.push(selectionReplacement);
	}

	await replaceSelectionsWithLines(editor, selections, replacesBySelection, false);
}
