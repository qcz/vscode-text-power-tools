import { v4 } from "node-uuid";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getPureSelections, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export enum  InsertNumbersNumberFormat {
	Decimal,
	Hex,
}

interface IGenerateGuidOptions {
	count: "single" | "multiple";
}

const FORMAT_NO_DASHES = "No dashes";
const FORMAT_DASHES = "Dashes";
const FORMAT_DASHES_AND_BRACES = "Dashes and braces";
const FORMAT_CSHARP = "C# Guid constructor";

export async function generateGuid(options: IGenerateGuidOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	askForGuidFormat(editor, options);
}

export async function askForGuidFormat(editor: vscode.TextEditor, options: IGenerateGuidOptions) {
	const settings = getExtensionSettings();
	let sampleGuid = v4();
	if (settings.insertUppercaseGuids) {
		sampleGuid = sampleGuid.toUpperCase();
	}
	
	const qp = vscode.window.createQuickPick();
	qp.items = [
		{ label: FORMAT_NO_DASHES, description: sampleGuid.replace(/[-]/g, "") },
		{ label: FORMAT_DASHES, description: sampleGuid },
		{ label: FORMAT_DASHES_AND_BRACES, description: `{${sampleGuid}}` },
		{ label: FORMAT_CSHARP, description: `new Guid("${sampleGuid}");` }
	];

	qp.onDidAccept(() => {
		if (!qp.activeItems.length) {
			return;
		}
		
		const selectedType = qp.activeItems[0].label;

		if (options.count === "multiple") {
			askForGuidCount(editor, selectedType);
		} else {
			generateGuidInternal(editor, selectedType, 1);
		}

		qp.hide();
		qp.dispose();
	});
	qp.show();
}

export async function askForGuidCount(editor: vscode.TextEditor, type: string) {
	vscode.window.showInputBox({
		placeHolder: `Please enter how many GUIDs do you want to generate`,
		value: "1",
	}).then(async (rawGuidCount: string | undefined) => {
		if (typeof rawGuidCount === "undefined") {
			return;
		}

		if (!rawGuidCount) {
			vscode.window.showErrorMessage("No number entered.");
			return;
		}

		const guidCount = Number.parseInt(rawGuidCount, 10);
		if (isNaN(guidCount)) {
			vscode.window.showErrorMessage(`The entered text is not a valid number.`);
			return;
		}

		generateGuidInternal(editor, type, guidCount);
	});
}



export async function generateGuidInternal(editor: vscode.TextEditor, type: string, guidCount: number) {
	const settings = getExtensionSettings();
	const replacesBySelection: string[][] = [];
	const selections = getPureSelections(editor);

	for (const _ of selections) {
		replacesBySelection.push([]);

		for (let i = 0; i < guidCount; i++) {
			let guid = v4();

			if (settings.insertUppercaseGuids) {
				guid = guid.toUpperCase();
			}

			if (type === FORMAT_NO_DASHES) {
				guid = guid.replace(/[-]/g, "");
			} else if (type === FORMAT_DASHES_AND_BRACES) {
				guid = `{${guid}}`;
			} else if (type === FORMAT_CSHARP) {
				guid = `new Guid("${guid}");`;
			}

			replacesBySelection[replacesBySelection.length - 1].push(guid);
		}
	}

	await replaceSelectionsWithLines(editor, selections, replacesBySelection, false);
}
