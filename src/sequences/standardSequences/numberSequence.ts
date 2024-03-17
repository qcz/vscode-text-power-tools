import RomanNumeral from "js-roman-numerals";
import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { NumeralSystem } from "../../interfaces";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, EnsureAllParametersAreSetResult, isSequenceErrorMessage } from "../sequenceTypes";

export class NumberSequece extends ASequenceBase {
	constructor(
		private numeralSystem: NumeralSystem,
		private startingNumber: number | undefined,
		private increment: number | undefined
	) {
		super();
	}

	public get name(): string {
		const type = this.numeralSystem === NumeralSystem.Hexadecimal ? vscode.l10n.t("Hex numbers")
			: this.numeralSystem === NumeralSystem.Roman ? vscode.l10n.t("Roman numbers")
			: vscode.l10n.t("Decimal numbers");

		if (typeof this.startingNumber === "undefined" && typeof this.increment === "undefined") {
			return vscode.l10n.t("{0} with custom starting number and increment", type);
		} else if (typeof this.startingNumber === "undefined") {
			return vscode.l10n.t("{0} with custom starting number", type);
		} else if (typeof this.increment === "undefined") {
			return vscode.l10n.t("{0} with custom increment", type);
		} else {
			return type;
		}
	}

	public get icon(): string {
		return "symbol-number";
	}

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		const settings = getExtensionSettings();

		let startingNumber = typeof this.startingNumber === "number"
			? this.startingNumber
			: 1;
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
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal
				? vscode.l10n.t("hex")
				: vscode.l10n.t("decimal");

			vscode.window.showInputBox({
				prompt: vscode.l10n.t("Please enter the starting number in {0} format", numberType),
				value: "1",
			}).then(async (rawStartingNumber: string | undefined) => {
				if (typeof rawStartingNumber === "undefined"
					|| rawStartingNumber === "") {
					resolve({ errorMessage: vscode.l10n.t("No starting number entered.") });
					return;
				}

				const startingNumber = Number.parseInt(rawStartingNumber, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				if (isNaN(startingNumber)) {
					resolve({
						errorMessage: vscode.l10n.t(
							"The entered starting number is not a valid {0} number.",
							numberType
						)
					});
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
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal
				? vscode.l10n.t("hex")
				: vscode.l10n.t("decimal");

			vscode.window.showInputBox({
				prompt: vscode.l10n.t("Please enter the number to increment by in {0} format", numberType),
				value: "1",
			}).then(async (rawIncrement: string | undefined) => {
				if (typeof rawIncrement === "undefined"
					|| rawIncrement === "") {
					resolve({ errorMessage: vscode.l10n.t("No increment entered.") });
					return;
				}

				const increment = Number.parseInt(rawIncrement, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				if (isNaN(increment)) {
					resolve({
						errorMessage: vscode.l10n.t(
							"The entered number to increment by is not a valid {0} number.",
							numberType
						)
					});
					return;
				}

				if (increment === 0) {
					resolve({ errorMessage: vscode.l10n.t("Increment cannot be 0.") });
					return;
				}

				this.increment = increment;
				resolve(true);
			});
		});
	}
}
