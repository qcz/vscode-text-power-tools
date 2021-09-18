import * as vscode from "vscode";
import zalgo from "zalgo-js";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum ZalgificationIntensity {
	UltraLight,
	Light,
	Medium,
	Heavy
}

const ZALGO_INTENSITY_MAP: Map<ZalgificationIntensity, number> = new Map([
	[ZalgificationIntensity.UltraLight, 0.04],
	[ZalgificationIntensity.Light, 0.20],
	[ZalgificationIntensity.Medium, 0.5],
	[ZalgificationIntensity.Heavy, 1],
]);

interface IConvertToZalgoOptions {
	intensity: ZalgificationIntensity;
}

export async function runConvertToZalgoCommand(options: IConvertToZalgoOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);
	const linesBySelection: string[][] = [];
	const intensity = ZALGO_INTENSITY_MAP.get(options.intensity);

	for (const selection of selections) {
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];

		for (const lineContent of getSelectionLines(editor, selection)) {
			currentSelectionLines.push(zalgo(lineContent, {
				directions: {
					up: true,
					down: true,
					middle: true
				},
				intensity: intensity
			}));
		}
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
