import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, EnsureAllParametersAreSetResult, isSequenceErrorMessage, StringIteratorGeneratorFunction } from "../sequenceTypes";

const LOWERCASE_CHAR_TABLE: string = "0123456789abcdef";
const UPPERCASE_CHAR_TABLE: string = "0123456789ABCDEF";

export class RandomHexCharactersSequence extends ASequenceBase {
	public get name(): string {
		return `Random hex characters`;
	}

	public get order(): number {
		return 0;
	}

	constructor(
		private numberOfCharacters: number | undefined
	) {
		super();
	}

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal(this.numberOfCharacters);
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal(2);
	}

	public async createGeneratorFunctionInternal(numberOfCharacters: number | undefined)
		: Promise<StringIteratorGeneratorFunction>
	{
		const self = this;
		const settings = getExtensionSettings();

		const fun = function* (): IterableIterator<string> {
			while (true) {
				yield self.generateRandomItem(
					numberOfCharacters || 1,
					settings.insertUppercaseHexNumbers
				);
			}
		};
	
		return fun;
	}

	public generateRandomItem(
		numberOfCharacters: number,
		uppercase: boolean
	): string {
		let ret = "";
		for (let i = 0; i < numberOfCharacters; i++) {
			const index = Math.floor(Math.random() * Math.floor(16));
			ret += uppercase
				? UPPERCASE_CHAR_TABLE[index]
				: LOWERCASE_CHAR_TABLE[index];
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
				prompt: `Please enter how many characters an item should contain`,
				value: "1",
			}).then(async (filter: string | undefined) => {
				if (typeof filter === "undefined" || !filter) {
					resolve({ errorMessage: "No number of characters entered." });
					return;
				}
		
				const startingNumber = Number.parseInt(filter, 10);
				if (isNaN(startingNumber)) {
					resolve({ errorMessage: `The entered number of characters is not valid.` });
					return;
				}

				this.numberOfCharacters = startingNumber;
				resolve(true);
			});
		});
	}
}
