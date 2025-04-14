import { LoremIpsum } from "lorem-ipsum";
import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { SequenceBase } from "../sequenceBase";

export class LoremIpsumSentencesSequence extends SequenceBase {
	public get name(): string {
		return vscode.l10n.t("Lorem ipsum sentences");
	}

	public get icon(): string {
		return "selection";
	}

	public get order(): number {
		return 9000;
	}

	public get sampleSize(): number {
		return 1;
	}

	public async createGenerator(): Promise<() => IterableIterator<string>> {
		const settings = getExtensionSettings();

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

		return function* (): IterableIterator<string> {
			while (true) {
				yield lorem.generateSentences(1);
			}
		};
	}
}
