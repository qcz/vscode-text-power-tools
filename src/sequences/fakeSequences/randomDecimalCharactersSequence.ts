import * as vscode from "vscode";
import { ParameterizedSequence } from "../sequenceBase";
import { EnsureAllParametersAreSetResult, EnsureParameterIsSetResult, StringIteratorGeneratorFunction, isSequenceErrorMessage } from "../sequenceTypes";

const CHAR_TABLE: string = "0123456789";

interface SequenceGeneratorParameters {
	numberOfCharacters: number;
}

export class RandomDecimalCharactersSequence extends ParameterizedSequence<SequenceGeneratorParameters> {
	constructor(
		numberOfCharacters: number | undefined
	) {
		const defaultParameters = {
			numberOfCharacters: numberOfCharacters
		};
		const sampleParameters = {
			numberOfCharacters: numberOfCharacters ?? 2
		};

		super(defaultParameters, sampleParameters);
	}

	public get icon(): string {
		return "symbol-number";
	}

	public get order(): number {
		return 100;
	}

	public get name(): string {
		return vscode.l10n.t("Random decimal characters");
	}

	protected createParameterizedGenerator(parameters: SequenceGeneratorParameters): StringIteratorGeneratorFunction {
		var self = this;
		return function* (): IterableIterator<string> {
			while (true) {
				yield self.generateRandomItem(parameters);
			}
		};
	}

	public generateRandomItem(parameters: SequenceGeneratorParameters): string {
		let ret = "";
		for (let i = 0; i < parameters.numberOfCharacters; i++) {
			const index = Math.floor(Math.random() * 10);
			ret += CHAR_TABLE[index];
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
