import { getExtensionSettings } from "../../helpers/tptSettings";
import { NumeralSystem } from "../../interfaces";
import { ASequenceBase } from "../sequenceBase";
import RomanNumeral  from "js-roman-numerals";
import * as vscode from "vscode";
import {  CreateSampleGeneratorResult, EnsureAllParametersAreSetResult, isSequenceErrorMessage } from "../sequenceTypes";

export class NumberSequece extends ASequenceBase {
	constructor(
		private numeralSystem: NumeralSystem,
		private startingNumber: number | undefined,
		private increment: number | undefined
	) {
		super();
	}

	public get name(): string {
		const type = this.numeralSystem === NumeralSystem.Hexadecimal ? "Hex"
			: this.numeralSystem === NumeralSystem.Roman ? "Roman"
			: "Decimal";

		let ret = `${type} numbers`;
		if (typeof this.startingNumber === "undefined" && typeof this.increment === "undefined") {
			ret += " with custom starting number and increment";
		} else if (typeof this.startingNumber === "undefined") {
			ret += " with custom starting number";
		} else if (typeof this.increment === "undefined") {
			ret += " with custom increment";
		}

		return ret;
	}

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		const settings = getExtensionSettings();

		let startingNumber = this.startingNumber || 1;
		let increment = this.increment || 1;

		return this.createGeneratorFunctionInternal(
			this.numeralSystem,
			startingNumber,
			increment,
			settings.insertUppercaseHexNumbers
		);
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		const settings = getExtensionSettings();

		let startingNumber: number;
		let increment: number;
		
		if (typeof this.startingNumber === "undefined") {
			startingNumber = 42;
		} else {
			startingNumber = this.startingNumber;
		}

		if (typeof this.increment === "undefined") {
			increment = 5;
		} else {
			increment = this.increment;
		}

		return this.createGeneratorFunctionInternal(
			this.numeralSystem,
			startingNumber,
			increment,
			settings.insertUppercaseHexNumbers
		);
	}

	private createGeneratorFunctionInternal(
		numeralSystem: NumeralSystem,
		startingNumber: number,
		increment: number,
		insertUppercaseHexNumbers: boolean
	): () => IterableIterator<string> {
		const fun = function* (): IterableIterator<string> {
			let insertedNumber: number = startingNumber;
			while (true) {
				if (numeralSystem === NumeralSystem.Roman) {
					if (insertedNumber > 3999 || insertedNumber < 1) {
						yield insertedNumber.toString();
					}

					yield new RomanNumeral(insertedNumber).toString();
				} else if (numeralSystem === NumeralSystem.Hexadecimal) {
					let insertedString = insertedNumber.toString(16);
					if (insertUppercaseHexNumbers) {
						insertedString = insertedString.toLocaleUpperCase();
					}
		
					yield insertedString;
				} else {
					yield insertedNumber.toString();
				}
		
				insertedNumber += increment;
			}
		};

		return fun;
	}

	public async ensureAllParametersAreSet(): Promise<EnsureAllParametersAreSetResult> {
		if (typeof this.startingNumber === "undefined") {
			const res = await this.askForStartingNumber();
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		if (typeof this.increment === "undefined") {
			const res = await this.askForIncrement();
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return true;
	}

	private askForStartingNumber(): Promise<EnsureAllParametersAreSetResult> {
		return new Promise<EnsureAllParametersAreSetResult>((resolve) => {
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal ? "hex" : "decimal";

			vscode.window.showInputBox({
				prompt: `Please enter the starting number in ${numberType} format`,
				value: "1",
			}).then(async (filter: string | undefined) => {
				if (typeof filter === "undefined") {
					resolve({ errorMessage: "No starting number entered." });
					return;
				}
		
				if (!filter) {
					resolve({ errorMessage: "No starting number entered." });
					return;
				}
		
				const startingNumber = Number.parseInt(filter, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				if (isNaN(startingNumber)) {
					resolve({ errorMessage: `The entered starting number is not a valid ${numberType} number.` });
					return;
				}
		
				// TODO: warn for too big Roman number

				this.startingNumber = startingNumber;
				resolve(true);
			});
		});
	}

	private askForIncrement(): Promise<EnsureAllParametersAreSetResult> {
		return new Promise<EnsureAllParametersAreSetResult>((resolve) => {
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal ? "hex" : "decimal";

			vscode.window.showInputBox({
				prompt: `Please enter the number to increment by in ${numberType} format`,
				value: "1",
			}).then(async (filter: string | undefined) => {
				if (typeof filter === "undefined") {
					resolve({ errorMessage: "No increment entered." });
					return;
				}
		
				if (!filter) {
					resolve({ errorMessage: "No increment entered." });
					return;
				}
		
				const increment = Number.parseInt(filter, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				if (isNaN(increment)) {
					resolve({ errorMessage: `The entered number to increment by is not a valid ${numberType} number.` });
					return;
				}

				this.increment = increment;
				resolve(true);
			});
		});
	}
}
