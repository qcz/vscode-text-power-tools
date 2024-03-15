import * as vscode from "vscode";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, EnsureAllParametersAreSetResult, isSequenceErrorMessage, StringIteratorGeneratorFunction } from "../sequenceTypes";

const CHAR_TABLE: string = "0123456789";

export class RandomDecimalCharactersSequence extends ASequenceBase {
	constructor(
		private numberOfCharacters: number | undefined
	) {
		super();
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

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal(this.numberOfCharacters);
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal(2);
	}

	public async createGeneratorFunctionInternal(numberOfCharacters: number | undefined)
		: Promise<StringIteratorGeneratorFunction> {
		var self = this;
		const fun = function* (): IterableIterator<string> {
			while (true) {
				yield self.generateRandomItem(numberOfCharacters || 1);
			}
		};

		return fun;
	}

	public generateRandomItem(numberOfCharacters: number): string {
		let ret = "";
		for (let i = 0; i < numberOfCharacters; i++) {
			const index = Math.floor(Math.random() * 10);
			ret += CHAR_TABLE[index];
		}

		return ret;
	}

	public async ensureAllParametersAreSet(): Promise<EnsureAllParametersAreSetResult> {
		if (typeof this.numberOfCharacters === "undefined") {
			const res = await this.askForNumberOfCharacters();
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return true;
	}

	private askForNumberOfCharacters(): Promise<EnsureAllParametersAreSetResult> {
		return new Promise<EnsureAllParametersAreSetResult>((resolve) => {
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

				this.numberOfCharacters = startingNumber;
				resolve(true);
			});
		});
	}
}
