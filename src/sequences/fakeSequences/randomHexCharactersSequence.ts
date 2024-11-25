import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ParameterizedSequence } from "../sequenceBase";
import { EnsureAllParametersAreSetResult, EnsureParameterIsSetResult, StringIteratorGeneratorFunction, isSequenceErrorMessage } from "../sequenceTypes";

const LOWERCASE_CHAR_TABLE: string = "0123456789abcdef";
const UPPERCASE_CHAR_TABLE: string = "0123456789ABCDEF";

interface SequenceGeneratorParameters {
	numberOfCharacters: number;
}

export class RandomHexCharactersSequence extends ParameterizedSequence<SequenceGeneratorParameters> {
	public get name(): string {
		return vscode.l10n.t("Random hex characters");
	}

	public get icon(): string {
		return "symbol-number";
	}

	public get order(): number {
		return 100;
	}

	constructor(
		numberOfCharacters: number | undefined
	) {
		const defaultParameters = {
			numberOfCharacters: numberOfCharacters,
		};
		const sampleParameters = {
			numberOfCharacters: numberOfCharacters ?? 2
		};

		super(defaultParameters, sampleParameters);
	}

	protected createParameterizedGenerator(parameters: SequenceGeneratorParameters): StringIteratorGeneratorFunction {
		const self = this;
		const settings = getExtensionSettings();

		return function* (): IterableIterator<string> {
			while (true) {
				yield self.generateRandomItem(
					parameters.numberOfCharacters,
					settings.insertUppercaseHexNumbers
				);
			}
		};
	}

	public generateRandomItem(
		numberOfCharacters: number,
		uppercase: boolean
	): string {
		let ret = "";
		for (let i = 0; i < numberOfCharacters; i++) {
			const index = Math.floor(Math.random() * 16);
			ret += uppercase
				? UPPERCASE_CHAR_TABLE[index]
				: LOWERCASE_CHAR_TABLE[index];
		}

		return ret;
	}

	public async ensureAllParametersAreSet(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureAllParametersAreSetResult<SequenceGeneratorParameters>> {
		if (typeof parameters.numberOfCharacters === "undefined") {
			const res = await this.askForNumberOfCharacters(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return parameters as SequenceGeneratorParameters;
	}

	private askForNumberOfCharacters(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
			vscode.window.showInputBox({
				prompt: vscode.l10n.t("Please enter how many characters an item should contain"),
				value: "1",
			}).then(async (filter: string | undefined) => {
				if (typeof filter === "undefined" || !filter) {
					resolve({ errorMessage: vscode.l10n.t("No number of characters entered.") });
					return;
				}

				const startingNumber = Number.parseInt(filter, 10);
				if (isNaN(startingNumber)) {
					resolve({ errorMessage: vscode.l10n.t("The entered number of characters is not valid.") });
					return;
				}

				parameters.numberOfCharacters = startingNumber;
				resolve(true);
			});
		});
	}
}
