import { LoremIpsum } from "lorem-ipsum";
import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, StringIteratorGeneratorFunction } from "../sequenceTypes";

export class LoremIpsumSentencesSequence extends ASequenceBase {
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

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal();
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal();
	}

	public async createGeneratorFunctionInternal() : Promise<StringIteratorGeneratorFunction> {
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

		const fun = function* (): IterableIterator<string> {
			while (true) {
				yield lorem.generateSentences(1);
			}
		};

		return fun;
	}
}
