import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getExtensionSettings } from "../helpers/tptSettings";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";
import { NumberArithmetic, NumeralSystem } from "../interfaces";
import { SIGNED_HEXADECIMAL_NUMBER_REGEX, DECIMAL_NUMBER_REGEX, UNSIGNED_HEXADECIMAL_NUMBER_REGEX } from "../helpers/textualNumberConverter";

type ArithmeticRange = {
	min: bigint;
	max: bigint;
};

const UNSIGNED_ARITHMETIC_RANGES: { [key in NumberArithmetic]: ArithmeticRange } = {
	[NumberArithmetic.SixtyFourBit]: { min: 0n, max: 18_446_744_073_709_551_615n },
	[NumberArithmetic.ThirtyTwoBit]: { min: 0n, max: 4_294_967_295n },
	[NumberArithmetic.SixteenBit]: { min: 0n, max: 65_535n },
	[NumberArithmetic.EightBit]: { min: 0n, max: 255n },
};

const SIGNED_ARITHMETIC_RANGES: { [key in NumberArithmetic]: ArithmeticRange } = {
	[NumberArithmetic.SixtyFourBit]: { min: -9_223_372_036_854_775_808n, max: 9_223_372_036_854_775_807n },
	[NumberArithmetic.ThirtyTwoBit]: { min: -2_147_483_648n, max: 2_147_483_647n },
	[NumberArithmetic.SixteenBit]: { min: -32_768n, max: 32_767n },
	[NumberArithmetic.EightBit]: { min: -128n, max: 127n },
};

interface IChangeNumeralSystemOptions {
	source: NumeralSystem;
	target: NumeralSystem;
	arithmetic?: NumberArithmetic;
	increment?: bigint | "ask";
}

export async function runConvertNumberCommand(options: IChangeNumeralSystemOptions) {
	const settings = getExtensionSettings();
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const { source: sourceNumeralSystem, target: targetNumeralSystem, arithmetic } = options;
	let increment = options.increment;
	if (increment === "ask") {
		try {
			increment = await askForIncrement();
		} catch (err) {
			vscode.window.showErrorMessage(err as string);
			return;
		}
	}

	const selections = getSelectionsOrFullDocument(editor);
	const linesBySelection: string[][] = [];

	let hasInvalidNumbers = false;
	let hasValidNumbers = false;
	for (const selection of selections) {
		linesBySelection.push([]);
		const currentSelectionLines = linesBySelection[linesBySelection.length - 1];

		for (const lineContent of getSelectionLines(editor, selection)) {
			// Skip empty lines
			if (lineContent.length === 0 || lineContent.match(/^\s+$/)) {
				currentSelectionLines.push(lineContent);
				continue;
			}

			let num: bigint;

			if (sourceNumeralSystem === NumeralSystem.Hexadecimal
				&& ((typeof arithmetic === "undefined" && SIGNED_HEXADECIMAL_NUMBER_REGEX.test(lineContent))
					|| (typeof arithmetic !== "undefined" && UNSIGNED_HEXADECIMAL_NUMBER_REGEX.test(lineContent))
				)
			) {

				const result = tryParseHexNumber(lineContent, options);
				if (result.isValid === false) {
					hasInvalidNumbers = true;
					currentSelectionLines.push(lineContent);
					continue;
				}

				num = result.number;

			} else if (sourceNumeralSystem === NumeralSystem.Decimal
				&& DECIMAL_NUMBER_REGEX.test(lineContent)) {

				const result = tryParseDecimalNumber(lineContent, options);
				if (result.isValid === false) {
					hasInvalidNumbers = true;
					currentSelectionLines.push(lineContent);
					continue;
				}

				num = result.number;

			} else {
				if (lineContent !== "") {
					hasInvalidNumbers = true;
				}

				currentSelectionLines.push(lineContent);
				continue;
			}

			if (typeof increment === "bigint") {
				num += increment;
				if (targetNumeralSystem === NumeralSystem.Hexadecimal && typeof arithmetic !== "undefined") {
					num = handleOverflow(num, arithmetic);
				}
			}

			let replacedContent = "";
			if (targetNumeralSystem === NumeralSystem.Decimal) {
				if (typeof arithmetic !== "undefined") {
					num = transformHexadecimalNumberToDecimalWithArithmetic(num, arithmetic);
				}

				replacedContent = num.toString(10);
			} else if (targetNumeralSystem === NumeralSystem.Hexadecimal) {
				if (typeof arithmetic !== "undefined") {
					num = transformDecimalNumberToHexWithArithmetic(num, arithmetic);
				}

				replacedContent= num.toString(16);
			}

			if (settings.insertUppercaseHexNumbers) {
				replacedContent = replacedContent.toLocaleUpperCase();
			}

			currentSelectionLines.push(replacedContent);
			hasValidNumbers = true;
		}
	}

	if (hasInvalidNumbers && hasValidNumbers === false) {
		vscode.window.showErrorMessage(
			"Failed to parse any lines in the selection as numbers.",
		);
	} else if (hasInvalidNumbers) {
		vscode.window.showErrorMessage(
			"Not all selections or lines could be parsed as numbers. Do you want to convert the recognized lines?",
			"Yes",
			"No"
		).then(async (selected) => {
			if (selected === "Yes") {
				await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
			}
		}, () => {

		});
	} else {
		await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
	}
}

type NumberParseResult =
	{ isValid: false }
	| { isValid: true; number: bigint };

async function askForIncrement(): Promise<bigint> {
	return new Promise<bigint>((resolve, reject) => {
		vscode.window.showInputBox({
			prompt: "Please enter the number to increment by in decimal format",
			value: "1",
		}).then(async (rawIncrement: string | undefined) => {
			if (typeof rawIncrement === "undefined"
				|| rawIncrement === "") {
				reject("No increment entered.");
				return;
			}

			let increment: bigint;
			try {
				increment = BigInt(rawIncrement);
			} catch (err) {
				reject("The entered number to increment by is not a valid number.");
				return;
			}

			if (increment === 0n) {
				reject("Increment cannot be 0.");
				return;
			}

			resolve(increment);
		});
	});
}

function tryParseHexNumber(rawNumber: string, options: IChangeNumeralSystemOptions): NumberParseResult {
	const { arithmetic } = options;

	let num: bigint;
	try {
		const isSigned = rawNumber[0] === "-";
		if (isSigned) {
			// BigInt cannot parse negative hex numbers so we have to circumvent it
			num = BigInt(`0x${rawNumber.substring(1)}`);
			num = num * -1n;
		} else {
			num = BigInt(`0x${rawNumber}`);
		}
	} catch (err) {
		return { isValid: false };
	}

	if (typeof arithmetic !== "undefined") {
		if (num > UNSIGNED_ARITHMETIC_RANGES[arithmetic].max || num < UNSIGNED_ARITHMETIC_RANGES[arithmetic].min) {
			return { isValid: false };
		}
	}

	return { isValid: true,  number: num };
}

function tryParseDecimalNumber(rawNumber: string, options: IChangeNumeralSystemOptions): NumberParseResult {
	const { arithmetic } = options;

	let num: bigint;
	try {
		num = BigInt(rawNumber);
	} catch (err) {
		return { isValid: false };
	}

	if (typeof arithmetic !== "undefined") {
		if (num > SIGNED_ARITHMETIC_RANGES[arithmetic].max || num < SIGNED_ARITHMETIC_RANGES[arithmetic].min) {
			return { isValid: false };
		}
	}

	return { isValid: true,  number: num };
}



function transformDecimalNumberToHexWithArithmetic(num: bigint, arithmetic: NumberArithmetic): bigint {
	if (typeof arithmetic === "undefined") {
		return num;
	}

	if (num < 0n) {
		return UNSIGNED_ARITHMETIC_RANGES[arithmetic].max - ((-num) - 1n);
	}

	return num;
}

function transformHexadecimalNumberToDecimalWithArithmetic(num: bigint, arithmetic: NumberArithmetic): bigint {
	if (typeof arithmetic === "undefined") {
		return num;
	}

	if (num > SIGNED_ARITHMETIC_RANGES[arithmetic].max) {
		return SIGNED_ARITHMETIC_RANGES[arithmetic].min + (num - SIGNED_ARITHMETIC_RANGES[arithmetic].max - 1n);
	}

	return num;
}

function handleOverflow(num: bigint, arithmetic: NumberArithmetic): bigint {
	let ret = num;

	while (ret > SIGNED_ARITHMETIC_RANGES[arithmetic].max
		|| ret < SIGNED_ARITHMETIC_RANGES[arithmetic].min) {
		if (ret > SIGNED_ARITHMETIC_RANGES[arithmetic].max) {
			ret = SIGNED_ARITHMETIC_RANGES[arithmetic].min + (ret - SIGNED_ARITHMETIC_RANGES[arithmetic].max - 1n);
		}

		if (ret < SIGNED_ARITHMETIC_RANGES[arithmetic].min) {
			ret = SIGNED_ARITHMETIC_RANGES[arithmetic].max - ((-ret) - 1n);
		}
	}

	return ret;
}

