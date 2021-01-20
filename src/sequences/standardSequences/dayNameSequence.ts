import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ASequenceBase } from "../sequenceBase";
import { StringIteratorGeneratorFunction } from "../sequenceTypes";

export class DayNamesSequence extends ASequenceBase {
	constructor(private locale: string | undefined, private type: "long" | "short" | "narrow") {
		super();
	}

	public get name(): string {
		const type = this.type === "long" ? "Long"
			: this.type === "narrow" ? "Narrow"
			: "Short";
		return typeof this.locale === "undefined" || this.locale === "" ? `${type} current/custom locale day names`
			: this.locale === "en-US" ? `${type} English day names`
			: `${this.type} ${this.locale} day names`;
	}

	public async createStandardGenerator(): Promise<StringIteratorGeneratorFunction> {
		const settings = getExtensionSettings();
		let locale = this.locale;
		if (locale === "" || typeof locale === "undefined") {
			locale = settings.customLocale;
			if (locale === "") {
				locale = undefined;
			}
		}

		const type = this.type;

		const fun = function* (): IterableIterator<string> {
			try {
				const formatter = new Intl.DateTimeFormat(locale, { weekday: type });
				for (let i = 1; i <= 7; i++) {
					yield formatter.format(
						new Date(2020, 5, i)
					);
				}
			} catch (err) {
				vscode.window.showErrorMessage(`Unknown locale provided for generator: '${locale}'`);
			}
		};
	
		return fun;
	}
}