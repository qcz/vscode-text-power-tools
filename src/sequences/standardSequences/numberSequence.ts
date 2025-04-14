import RomanNumeral from "js-roman-numerals";
import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { NumeralSystem } from "../../interfaces";
import { ParameterizedSequence } from "../sequenceBase";
import { EnsureAllParametersAreSetResult, EnsureParameterIsSetResult, isSequenceErrorMessage } from "../sequenceTypes";

interface NumberSequenceGeneratorParameters {
	startingNumber: number;
	increment: number;
}

export class NumberSequece extends ParameterizedSequence<NumberSequenceGeneratorParameters> {
	private numeralSystem: NumeralSystem;

	constructor(options: {
		numeralSystem: NumeralSystem,
		startingNumber: number | undefined,
		increment: number | undefined
	}) {
		const defaultParameters = {
			startingNumber: options.startingNumber,
			increment: options.increment
		};
		const sampleParameters = {
			startingNumber: options.startingNumber ?? 42,
			increment: options.increment ?? 5
		}

		super(defaultParameters, sampleParameters);

		this.numeralSystem = options.numeralSystem;
	}

	public get name(): string {
		const type = this.numeralSystem === NumeralSystem.Hexadecimal ? vscode.l10n.t("Hex numbers")
			: this.numeralSystem === NumeralSystem.Roman ? vscode.l10n.t("Roman numbers")
			: vscode.l10n.t("Decimal numbers");

		if (typeof this.defaultParameters.startingNumber === "undefined" && typeof this.defaultParameters.increment === "undefined") {
			return vscode.l10n.t("{0} with custom starting number and increment", type);
		} else if (typeof this.defaultParameters.startingNumber === "undefined") {
			return vscode.l10n.t("{0} with custom starting number", type);
		} else if (typeof this.defaultParameters.increment === "undefined") {
			return vscode.l10n.t("{0} with custom increment", type);
		} else {
			return type;
		}
	}

	public get icon(): string {
		return "symbol-number";
	}

	protected createParameterizedGenerator(
		parameters: NumberSequenceGeneratorParameters
	): () => IterableIterator<string> {
		const settings = getExtensionSettings();

		const self = this;

		return function* (): IterableIterator<string> {
			let insertedNumber: number = parameters.startingNumber;
			while (true) {
				if (self.numeralSystem === NumeralSystem.Roman) {
					if (insertedNumber > 3999 || insertedNumber < 1) {
						yield insertedNumber.toString();
					}

					yield new RomanNumeral(insertedNumber).toString();
				} else if (self.numeralSystem === NumeralSystem.Hexadecimal) {
					let insertedString = insertedNumber.toString(16);
					if (settings.insertUppercaseHexNumbers) {
						insertedString = insertedString.toLocaleUpperCase();
					}

					yield insertedString;
				} else {
					yield insertedNumber.toString();
				}

				insertedNumber += parameters.increment;
			}
		};
	}

	public async ensureAllParametersAreSet(parameters: Partial<NumberSequenceGeneratorParameters>)
		: Promise<EnsureAllParametersAreSetResult<NumberSequenceGeneratorParameters>>
	{
		if (typeof parameters.startingNumber === "undefined") {
			const res = await this.askForStartingNumber(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		if (typeof parameters.increment === "undefined") {
			const res = await this.askForIncrement(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return parameters as NumberSequenceGeneratorParameters;
	}

	private askForStartingNumber(parameters: Partial<NumberSequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
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

				parameters.startingNumber = startingNumber;
				resolve(true);
			});
		});
	}

	private askForIncrement(parameters: Partial<NumberSequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
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

				parameters.increment = increment;
				resolve(true);
			});
		});
	}
}
