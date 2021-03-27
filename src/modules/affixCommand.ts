import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getPureSelections, getSelectionLines, replaceSelectionsWithLines, sortSelectionsByPosition } from "../helpers/vsCodeHelpers";

export enum  AffixTarget {
	Prefix,
	Suffix,
	Both,
	Wrap
}

interface AffixOptions {
	target: AffixTarget;
}

export async function runAffixCommand(options: AffixOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const { target } = options;

	let prefix: string | null = null;
	let suffix: string | null = null;
	try {
		if (target === AffixTarget.Prefix) {
			prefix = await askForAffix(AffixTarget.Prefix);
		} else if (target === AffixTarget.Suffix) {
			suffix = await askForAffix(AffixTarget.Suffix);
		} else if (target === AffixTarget.Both) {
			prefix = suffix = await askForAffix(AffixTarget.Both);
		} else if (target === AffixTarget.Wrap) {
			prefix = await askForAffix(AffixTarget.Prefix);
			suffix = await askForAffix(AffixTarget.Suffix);
		}
	} catch (err) {
		vscode.window.showErrorMessage(err);
		return;
	}

	const selections = getPureSelections(editor);
	sortSelectionsByPosition(selections);

	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];

		for (const lineContent of getSelectionLines(editor, selection)) {
			currentSelectionLines.push(
				(prefix != null ? prefix : "")
				+ lineContent
				+ (suffix != null ? suffix : "")
			);
		}
	}
	
	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}

async function askForAffix(target: AffixTarget): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const targetLabel = target === AffixTarget.Both ? "Please enter the text to wrap the lines with"
			: target === AffixTarget.Prefix ? "Please enter the prefix for the lines"
			: "Please enter the suffix for the lines";

		vscode.window.showInputBox({
			prompt: targetLabel,
			value: "",
		}).then(async (affixString: string | undefined) => {
			if (typeof affixString === "undefined" || affixString === "") {
				const errorMessage = target === AffixTarget.Both ? "No text entered to wrap with"
					: target === AffixTarget.Prefix ? "No prefix entered"
					: "No suffix entered";
				reject(errorMessage);
				return;
			}

			resolve(affixString);
		});
	});
}
