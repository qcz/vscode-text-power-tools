import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { NumeralSystem } from "../../interfaces";
import { ParameterizedSequence } from "../sequenceBase";
import { EnsureAllParametersAreSetResult, EnsureParameterIsSetResult, StringIteratorGeneratorFunction, isSequenceErrorMessage } from "../sequenceTypes";

interface SequenceGeneratorParameters {
	rangeStart: number,
	rangeEnd: number
}

export class RandomNumberFromRangeSequence extends ParameterizedSequence<SequenceGeneratorParameters> {
	constructor(
		private numeralSystem: NumeralSystem,
		private isFloatingPoint: boolean,
	) {
		super({}, { rangeStart: 24, rangeEnd: 42 });
	}

	public get icon(): string {
		return "symbol-number";
	}

	public get order(): number {
		return 1;
	}

	public get name(): string {
		if (this.numeralSystem === NumeralSystem.Decimal && this.isFloatingPoint) {
			return vscode.l10n.t("Random real number from range");
		} else if (this.numeralSystem === NumeralSystem.Decimal) {
			return vscode.l10n.t("Random decimal number from range");
		} else {
			return vscode.l10n.t("Random hexadecimal number from range");
		}
	}

	protected createParameterizedGenerator(parameters: SequenceGeneratorParameters) : StringIteratorGeneratorFunction {
		const settings = getExtensionSettings();

		var self = this;
		const fun = function* (): IterableIterator<string> {
			if (typeof parameters.rangeStart === "undefined" || typeof parameters.rangeEnd === "undefined") {
				return;
			}

			while (true) {
				yield self.generateRandomItem(parameters.rangeStart, parameters.rangeEnd, settings.insertUppercaseHexNumbers);
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

	public async ensureAllParametersAreSet(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureAllParametersAreSetResult<SequenceGeneratorParameters>> {
		if (typeof parameters.rangeStart === "undefined") {
			const res = await this.askForRangeStart(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		if (typeof parameters.rangeEnd === "undefined") {
			const res = await this.askForRangeEnd(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return parameters as SequenceGeneratorParameters;
	}

	private askForRangeStart(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal
				? vscode.l10n.t("hex")
				: vscode.l10n.t("decimal");

			vscode.window.showInputBox({
				prompt: vscode.l10n.t("Please enter the starting number in {0} format (inclusive)", numberType),
				value: "1",
			}).then(async (rawRangeStart: string | undefined) => {
				if (typeof rawRangeStart === "undefined"
					|| rawRangeStart === "") {
					resolve({ errorMessage: vscode.l10n.t("No starting number entered.") });
					return;
				}

				let rangeStart;
				if (this.isFloatingPoint) {
					rangeStart = Number.parseFloat(rawRangeStart);
				} else {
					rangeStart = Number.parseInt(rawRangeStart, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				}
				if (isNaN(rangeStart)) {
					resolve({
						errorMessage: vscode.l10n.t(
							"The entered starting number is not a valid {0} number.",
							numberType
						)
					});
					return;
				}

				parameters.rangeStart = rangeStart;
				resolve(true);
			});
		});
	}

	private askForRangeEnd(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal
				? vscode.l10n.t("hex")
				: vscode.l10n.t("decimal");

			vscode.window.showInputBox({
				prompt: vscode.l10n.t("Please enter the ending number in {0} format (inclusive)", numberType),
				value: "1",
			}).then(async (rawRangeEnd: string | undefined) => {
				if (typeof rawRangeEnd === "undefined"
					|| rawRangeEnd === "") {
					resolve({ errorMessage: vscode.l10n.t("No ending number entered.") });
					return;
				}

				let rangeEnd;
				if (this.isFloatingPoint) {
					rangeEnd = Number.parseFloat(rawRangeEnd);
				} else {
					rangeEnd = Number.parseInt(rawRangeEnd, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				}
				if (isNaN(rangeEnd)) {
					resolve({
						errorMessage: vscode.l10n.t(
							"The entered ending number is not a valid {0} number.",
							numberType
						)
					});
					return;
				}

				parameters.rangeEnd = rangeEnd;
				resolve(true);
			});
		});
	}
}
