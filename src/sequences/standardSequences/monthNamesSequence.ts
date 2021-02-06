import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ASequenceBase } from "../sequenceBase";
import { StringIteratorGeneratorFunction } from "../sequenceTypes";

export class MonthNamesSequence extends ASequenceBase {
	constructor(private locale: string | undefined, private type: "long" | "short" | "narrow") {
		super();
	}

	public get name(): string {
		const type = this.type === "long" ? "Long"
			: this.type === "narrow" ? "Narrow"
			: "Short";
		return typeof this.locale === "undefined" || this.locale === "" ? `${type} current/custom locale month names`
			: this.locale === "en-US" ? `${type} English month names`
			: `${this.type} ${this.locale} month names`;
	}

	public get icon(): string {
		return "calendar";
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
				const formatter = new Intl.DateTimeFormat(locale, { month: type });
				for (let i = 0; i < 12; i++) {
					yield formatter.format(
						new Date(2020, i, 1)
					);
				}
			} catch (err) {
				vscode.window.showErrorMessage(`Unknown locale provided for generator: '${locale}'`);
			}
		};
	
		return fun;
	}
}