import { NumeralSystem } from "../interfaces";
import { ITextPowerToolsSettings } from "./tptSettings";

export const DECIMAL_NUMBER_REGEX = /^\d+$/;
export const HEXADECIMAL_NUMBER_REGEX = /^[0-9A-Fa-f]+$/;

export interface ConvertNumberResult {
	successful: boolean;
	result: string;
}

export function convertTextualNumber(
	lineContent: string,
	target: NumeralSystem,
	settings: ITextPowerToolsSettings
): ConvertNumberResult {
	let num;
	if (target === NumeralSystem.Decimal
		&& HEXADECIMAL_NUMBER_REGEX.test(lineContent)) {

		num = parseInt(lineContent, 16);
	} else if (target === NumeralSystem.Hexadecimal
		&& DECIMAL_NUMBER_REGEX.test(lineContent)) {

		num = parseInt(lineContent, 10);
	} else {
		return { successful: lineContent === "", result: lineContent };
	}

	if (Number.isNaN(num)) {
		return { successful:false, result: lineContent };
	}

	let replacedContent = num.toString(target === NumeralSystem.Decimal ? 10 : 16);
	if (settings.insertUppercaseHexNumbers) {
		replacedContent = replacedContent.toLocaleUpperCase();
	}

	return {successful: true, result: replacedContent };
}
