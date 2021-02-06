import { LoremIpsum } from "lorem-ipsum";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, StringIteratorGeneratorFunction } from "../sequenceTypes";

export class LoremIpsumParagraphsSequence extends ASequenceBase {
	public get name(): string {
		return `Lorem ipsum paragraphs`;
	}

	public get icon(): string {
		return "selection";
	}

	public get order(): number {
		return 9001;
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

	public async createGeneratorFunctionInternal()
		: Promise<StringIteratorGeneratorFunction>
	{
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
				yield lorem.generateParagraphs(1);
			}
		};
	
		return fun;
	}
}
