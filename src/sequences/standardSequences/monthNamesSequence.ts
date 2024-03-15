import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { getHumanizedLanguageName } from "../../helpers/utils";
import { ASequenceBase } from "../sequenceBase";
import { StringIteratorGeneratorFunction } from "../sequenceTypes";

export class MonthNamesSequence extends ASequenceBase {
	constructor(private locale: string | undefined, private type: "long" | "short" | "narrow") {
		super();
	}

	public get name(): string {
		const type = this.type === "long" ? vscode.l10n.t("Long")
			: this.type === "narrow" ? vscode.l10n.t("Narrow")
			: vscode.l10n.t("Short");
		return typeof this.locale === "undefined" || this.locale === "" ? vscode.l10n.t("{0} current/custom locale month names", type)
			: this.locale === "en-US" ? vscode.l10n.t("{0} English month names")
			: vscode.l10n.t("{0} {1} month names", type, getHumanizedLanguageName(this.locale));
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
				vscode.window.showErrorMessage(vscode.l10n.t("Unknown locale provided for generator: '{0}'", locale ?? "undefined"));
			}
		};

		return fun;
	}
}
