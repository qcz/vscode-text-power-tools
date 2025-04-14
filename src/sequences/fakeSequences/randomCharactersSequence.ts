import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ParameterizedSequence } from "../sequenceBase";
import { EnsureAllParametersAreSetResult, EnsureParameterIsSetResult, StringIteratorGeneratorFunction, isSequenceErrorMessage } from "../sequenceTypes";

const LOWERCASE_CHAR_TABLE: string = "0123456789abcdef";
const UPPERCASE_CHAR_TABLE: string = "0123456789ABCDEF";

interface SequenceGeneratorParameters {
	minCharacters: number;
	maxCharacters: number;
}

export abstract class WordsContainingRandomCharactersSequenceBase extends ParameterizedSequence<SequenceGeneratorParameters> {
	abstract get characterTable(): string;

	constructor() {
		const defaultParameters = {
			minCharacters: undefined,
			maxCharacters: undefined
		};
		const sampleParameters = {
			minCharacters: 2,
			maxCharacters: 10
		};

		super(defaultParameters, sampleParameters);
	}

	protected createParameterizedGenerator(parameters: SequenceGeneratorParameters): StringIteratorGeneratorFunction {
		const self = this;

		return function* (): IterableIterator<string> {
			while (true) {
				const characterTable = self.characterTable;

				yield self.generateRandomItem(
					characterTable,
					parameters
				);
			}
		};
	}

	public generateRandomItem(
		characterTable: string,
		parameters: SequenceGeneratorParameters
	): string {
		const numberOfCharacters =
			Math.floor(Math.random() * (parameters.maxCharacters - parameters.minCharacters))
			+ parameters.minCharacters;

		let ret = "";
		for (let i = 0; i < numberOfCharacters; i++) {
			const index = Math.floor(Math.random() * characterTable.length);
			ret += characterTable[index]
		}

		return ret;
	}

	public async ensureAllParametersAreSet(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureAllParametersAreSetResult<SequenceGeneratorParameters>> {
		if (typeof parameters.minCharacters === "undefined") {
			const res = await this.askForMinCharacters(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		if (typeof parameters.maxCharacters === "undefined") {
			const res = await this.askForMaxCharacters(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return parameters as SequenceGeneratorParameters;
	}

	private askForMinCharacters(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
			vscode.window.showInputBox({
				prompt: vscode.l10n.t("Please enter the minimum number of characters in each item"),
				value: "1",
			}).then(async (filter: string | undefined) => {
				if (typeof filter === "undefined" || !filter) {
					resolve({ errorMessage: vscode.l10n.t("No number of characters entered.") });
					return;
				}

				const minCharacters = Number.parseInt(filter, 10);
				if (isNaN(minCharacters)) {
					resolve({ errorMessage: vscode.l10n.t("The entered number of characters is not valid.") });
					return;
				}

				parameters.minCharacters = minCharacters;
				resolve(true);
			});
		});
	}

	private askForMaxCharacters(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
			vscode.window.showInputBox({
				prompt: vscode.l10n.t("Please enter the maximum number of characters in each item"),
				value: "1",
			}).then(async (filter: string | undefined) => {
				if (typeof filter === "undefined" || !filter) {
					resolve({ errorMessage: vscode.l10n.t("No number of characters entered.") });
					return;
				}

				const maxCharacters = Number.parseInt(filter, 10);
				if (isNaN(maxCharacters)) {
					resolve({ errorMessage: vscode.l10n.t("The entered number of characters is not valid.") });
					return;
				}

				if (maxCharacters < (parameters.minCharacters ?? 0)) {
					resolve({ errorMessage: vscode.l10n.t("The maximum number of characters cannot be lower than the minimum number of characters.") });
					return;
				}

				parameters.maxCharacters = maxCharacters;
				resolve(true);
			});
		});
	}
}


export class WordsContainingRandomLowercaseLettersSequence extends WordsContainingRandomCharactersSequenceBase {
	public get name(): string {
		return vscode.l10n.t("Words containing random lowercase letters");
	}

	public get icon(): string {
		return "whole-word";
	}

	public get order(): number {
		return 101;
	}

	public get characterTable(): string {
		return "abcdefghijklmnopqrstuvwxyz";
	}
}

export class WordsContainingRandomUppercaseLettersSequence extends WordsContainingRandomCharactersSequenceBase {
	public get name(): string {
		return vscode.l10n.t("Words containing random uppercase letters");
	}

	public get icon(): string {
		return "whole-word";
	}

	public get order(): number {
		return 102;
	}

	public get characterTable(): string {
		return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}
}

export class WordsContainingRandomLettersSequence extends WordsContainingRandomCharactersSequenceBase {
	public get name(): string {
		return vscode.l10n.t("Words containing random letters");
	}

	public get icon(): string {
		return "whole-word";
	}

	public get order(): number {
		return 103;
	}

	public get characterTable(): string {
		return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}
}

export class WordsContainingRandomAlphanumericCharactersSequence extends WordsContainingRandomCharactersSequenceBase {
	public get name(): string {
		return vscode.l10n.t("Words containing random alphanumeric characters");
	}

	public get icon(): string {
		return "whole-word";
	}

	public get order(): number {
		return 104;
	}

	public get characterTable(): string {
		return "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	}
}

export class WordsContainingRandomAsciiCharactersSequence extends WordsContainingRandomCharactersSequenceBase {
	public get name(): string {
		return vscode.l10n.t("Words containing random ASCII characters");
	}

	public get icon(): string {
		return "whole-word";
	}

	public get order(): number {
		return 105;
	}

	public get characterTable(): string {
		return "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[]^_`{|}~";
	}
}


export class WordsContainingRandomDecimalCharactersSequence extends WordsContainingRandomCharactersSequenceBase {
	public get name(): string {
		return vscode.l10n.t("Words containing random decimal characters");
	}

	public get icon(): string {
		return "symbol-number";
	}

	public get order(): number {
		return 106;
	}

	public get characterTable(): string {
		return "0123456789";
	}
}


export class WordsContainingRandomHexCharactersSequence extends WordsContainingRandomCharactersSequenceBase {
	public get name(): string {
		return vscode.l10n.t("Words containing random hex characters");
	}

	public get icon(): string {
		return "symbol-number";
	}

	public get order(): number {
		return 107;
	}

	public get characterTable(): string {
		const settings = getExtensionSettings();
		return settings.insertUppercaseHexNumbers
			? UPPERCASE_CHAR_TABLE
			: LOWERCASE_CHAR_TABLE;
	}
}
