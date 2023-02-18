import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { NumeralSystem } from "../../interfaces";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, EnsureAllParametersAreSetResult, isSequenceErrorMessage, StringIteratorGeneratorFunction } from "../sequenceTypes";

export class RandomNumberFromRangeSequence extends ASequenceBase {
	constructor(
		private numeralSystem: NumeralSystem,
		private isFloatingPoint: boolean,
		private rangeStart?: number | undefined,
		private rangeEnd?: number | undefined
	) {
		super();
	}

	public get icon(): string {
		return "symbol-number";
	}

	public get order(): number {
		return 1;
	}

	public get name(): string {
		let numberType;
		if (this.numeralSystem === NumeralSystem.Decimal) {
			numberType = this.isFloatingPoint ? "real" : "decimal";
		} else {
			numberType = "hexadecimal";
		}

		return `Random ${numberType} number from range`;
	}

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		const settings = getExtensionSettings();
		return this.createGeneratorFunctionInternal(this.rangeStart, this.rangeEnd, settings.insertUppercaseHexNumbers);
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		const settings = getExtensionSettings();
		return this.createGeneratorFunctionInternal(24, 42, settings.insertUppercaseHexNumbers);
	}

	public async createGeneratorFunctionInternal(
		rangeStart: number | undefined,
		rangeEnd: number | undefined,
		insertUppercaseHexNumbers: boolean
	) : Promise<StringIteratorGeneratorFunction> {
		var self = this;
		const fun = function* (): IterableIterator<string> {
			if (typeof rangeStart === "undefined" || typeof rangeEnd === "undefined") {
				return;
			}

			while (true) {
				yield self.generateRandomItem(rangeStart, rangeEnd, insertUppercaseHexNumbers);
			}
		};

		return fun;
	}

	public generateRandomItem(rangeStart: number, rangeEnd: number, insertUppercaseHexNumbers: boolean): string {
		let insertedNumber = Math.random() * (rangeEnd - rangeStart) + rangeStart;
		if (!this.isFloatingPoint) {
			insertedNumber = Math.round(insertedNumber);
		}

		if (this.numeralSystem === NumeralSystem.Hexadecimal) {
			let insertedString = insertedNumber.toString(16);
			if (insertUppercaseHexNumbers) {
				insertedString = insertedString.toLocaleUpperCase();
			}
			return insertedString;
		} else {
			return insertedNumber.toString();
		}

	}

	public async ensureAllParametersAreSet(): Promise<EnsureAllParametersAreSetResult> {
		if (typeof this.rangeStart === "undefined") {
			const res = await this.askForRangeStart();
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		if (typeof this.rangeEnd === "undefined") {
			const res = await this.askForRangeEnd();
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return true;
	}

	private askForRangeStart(): Promise<EnsureAllParametersAreSetResult> {
		return new Promise<EnsureAllParametersAreSetResult>((resolve) => {
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal ? "hex" : "decimal";

			vscode.window.showInputBox({
				prompt: `Please enter the starting number in ${numberType} format (inclusive)`,
				value: "1",
			}).then(async (rawRangeStart: string | undefined) => {
				if (typeof rawRangeStart === "undefined"
					|| rawRangeStart === "") {
					resolve({ errorMessage: "No starting number entered." });
					return;
				}

				let rangeStart;
				if (this.isFloatingPoint) {
					rangeStart = Number.parseFloat(rawRangeStart);
				} else {
					rangeStart = Number.parseInt(rawRangeStart, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				}
				if (isNaN(rangeStart)) {
					resolve({ errorMessage: `The entered starting number is not a valid ${numberType} number.` });
					return;
				}

				this.rangeStart = rangeStart;
				resolve(true);
			});
		});
	}

	private askForRangeEnd(): Promise<EnsureAllParametersAreSetResult> {
		return new Promise<EnsureAllParametersAreSetResult>((resolve) => {
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal ? "hex" : "decimal";

			vscode.window.showInputBox({
				prompt: `Please enter the ending number in ${numberType} format (inclusive)`,
				value: "1",
			}).then(async (rawRangeEnd: string | undefined) => {
				if (typeof rawRangeEnd === "undefined"
					|| rawRangeEnd === "") {
					resolve({ errorMessage: "No ending number entered." });
					return;
				}

				let rangeEnd;
				if (this.isFloatingPoint) {
					rangeEnd = Number.parseFloat(rawRangeEnd);
				} else {
					rangeEnd = Number.parseInt(rawRangeEnd, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				}
				if (isNaN(rangeEnd)) {
					resolve({ errorMessage: `The entered ending number is not a valid ${numberType} number.` });
					return;
				}

				this.rangeEnd = rangeEnd;
				resolve(true);
			});
		});
	}
}
