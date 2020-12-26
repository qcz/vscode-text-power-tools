import { getExtensionSettings } from "../../helpers/tptSettings";
import { NumeralSystem } from "../../interfaces";
import { ASequenceBase } from "../sequenceBase";
import RomanNumeral  from "js-roman-numerals";
import * as vscode from "vscode";

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

	public async createGenerator(forSample: boolean): Promise<() => IterableIterator<string>> {
		const settings = getExtensionSettings();
		const numeralSystem = this.numeralSystem;

		if (forSample === false) {
			await this.ensureAllParametersAreSet();
		}

		let startingNumber = this.startingNumber || 1;
		let increment = this.increment || 1;
		
		if (forSample === true) {
			if (typeof this.startingNumber === "undefined") {
				startingNumber = 42;
			}

			if (typeof this.increment === "undefined") {
				increment = 5;
			}
		}

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
					if (settings.insertUppercaseHexNumbers) {
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

	public async ensureAllParametersAreSet(): Promise<void> {
		if (typeof this.startingNumber === "undefined") {
			await this.askForStartingNumber();
		}

		if (typeof this.increment === "undefined") {
			await this.askForIncrement();
		}
	}

	private askForStartingNumber(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal ? "hex" : "decimal";

			vscode.window.showInputBox({
				prompt: `Please enter the starting number in ${numberType} format`,
				value: "1",
			}).then(async (filter: string | undefined) => {
				if (typeof filter === "undefined") {
					reject();
					return;
				}
		
				if (!filter) {
					vscode.window.showErrorMessage("No starting number entered.");
					reject();
					return;
				}
		
				const startingNumber = Number.parseInt(filter, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				if (isNaN(startingNumber)) {
					vscode.window.showErrorMessage(`The entered starting number is not a valid ${numberType} number.`);
					reject();
					return;
				}
		
				// TODO: warn for too big roman number

				this.startingNumber = startingNumber;
				resolve();
			});
		});
	}

	private askForIncrement(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const numberType = this.numeralSystem === NumeralSystem.Hexadecimal ? "hex" : "decimal";

			vscode.window.showInputBox({
				prompt: `Please enter the number to increment by in ${numberType} format`,
				value: "1",
			}).then(async (filter: string | undefined) => {
				if (typeof filter === "undefined") {
					reject();
					return;
				}
		
				if (!filter) {
					vscode.window.showErrorMessage("No increment entered.");
					reject();
					return;
				}
		
				const increment = Number.parseInt(filter, this.numeralSystem === NumeralSystem.Hexadecimal ? 16 : 10);
				if (isNaN(increment)) {
					vscode.window.showErrorMessage(`The entered number to increment by is not a valid ${numberType} number.`);
					reject();
					return;
				}

				this.increment = increment;
				resolve();
			});
		});
	}
}