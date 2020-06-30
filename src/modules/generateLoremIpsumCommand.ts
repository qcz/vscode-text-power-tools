import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getPureSelections, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";
import { LoremIpsum } from "lorem-ipsum";

type LoremIpsumGenerationType = "sentence" | "fiveSentences" | "paragraph" | "fiveParagraphs";

interface IGenerateLoremIpsumOptions {
	type: LoremIpsumGenerationType;
}

export async function runGenerateLoremIpsumCommand(options: IGenerateLoremIpsumOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	generateLoremIpsumInternal(editor, options);
}

export async function generateLoremIpsumInternal(editor: vscode.TextEditor, options: IGenerateLoremIpsumOptions) {
	const settings = getExtensionSettings();

	if (settings.loremIpsumMaxWordsPerSentence < settings.loremIpsumMinWordsPerSentence) {
		vscode.window.showWarningMessage("Invalid settings: `textPowerTools.loremIpsum.wordsPerSentence.min` cannot be larger than `textPowerTools.loremIpsum.wordsPerSentence.max`.");
		return;
	}

	if (settings.loremIpsumMaxSentencesPerParagraph < settings.loremIpsumMinSentencesPerParagraph) {
		vscode.window.showWarningMessage("Invalid settings: `textPowerTools.loremIpsum.sentencesPerParagraph.min` cannot be larger than `textPowerTools.loremIpsum.sentencesPerParagraph.max`.");
		return;
	}

	const replacesBySelection: string[][] = [];

	const selections = getPureSelections(editor);

	for (const _ of selections) {
		replacesBySelection.push([]);

		const lorem = new LoremIpsum({
			wordsPerSentence: {
				min: settings.loremIpsumMinWordsPerSentence,
				max: settings.loremIpsumMaxWordsPerSentence,
			},
			sentencesPerParagraph: {
				min: settings.loremIpsumMinSentencesPerParagraph,
				max: settings.loremIpsumMaxSentencesPerParagraph,
			},
		});
		
		let content = "";
		if (options.type === "sentence") {
			content = lorem.generateSentences(1);
		} else if (options.type === "fiveSentences") {
			content = lorem.generateSentences(5);
		} else if (options.type === "paragraph") {
			content = lorem.generateParagraphs(1);
		} else if (options.type === "fiveParagraphs") {
			content = lorem.generateParagraphs(5);
		}

		replacesBySelection[replacesBySelection.length - 1].push(content);
	}

	await replaceSelectionsWithLines(editor, selections, replacesBySelection, false);
}
