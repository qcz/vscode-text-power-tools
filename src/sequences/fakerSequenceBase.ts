import faker from "faker";
import { ASequenceBase } from "./sequenceBase";
import { CreateSampleGeneratorResult, StringIteratorGeneratorFunction } from "./sequenceTypes";

export abstract class AFakerSequenceBase extends ASequenceBase {
	protected get humanizedLanguageName(): string {
		switch (this.locale) {
			case "cz":
				return "Czech";
			case "de":
				return "German";
			case "el":
				return "Greek";
			case "en":
				return "English";
			case "es":
				return "Spanish";
			case "fi":
				return "Finnish";
			case "fr":
				return "French";
			case "hr":
				return "Croatian";
			case "hu":
				return "Hungarian";
			case "id_ID":
				return "Indonesian";
			case "it":
				return "Italian";
			case "ja":
				return "Japanese";
			case "ko":
				return "Korean";
			case "lv":
				return "Latvian";
			case "nb_NO":
				return "Norwegian";
			case "nl":
				return "Dutch";
			case "pl":
				return "Polish";
			case "pt_BR":
				return "Portugese (Brazil)";
			case "pt_PT":
				return "Portugese (Portugal)";
			case "ro":
				return "Romanian";
			case "ru":
				return "Russian";
			case "sk":
				return "Slovakian";
			case "sv":
				return "Swedish";
			case "tr":
				return "Turkish";
			case "uk":
				return "Ukranian";
			case "vi":
				return "Vietnamese";
			default:
				return this.locale;
		}
	}

	constructor(protected locale: string) {
		super();
	}

	protected abstract generateFakerItem(): string;

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal(() => {
			faker.setLocale(this.locale);
			faker.seed(Math.random());
		});
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal(() => {
			faker.setLocale(this.locale);
			faker.seed(42);
		});
	}

	public async createGeneratorFunctionInternal(initFaker: () => void): Promise<StringIteratorGeneratorFunction> {
		const self = this;

		const fun = function* (): IterableIterator<string> {
			initFaker();

			while (true) {
				yield self.generateFakerItem();
			}
		};

		return fun;
	}
}
