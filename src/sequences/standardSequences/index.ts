import { NumeralSystem } from "../../interfaces";
import { ASequenceBase } from "../sequenceBase";
import { DayNamesSequence } from "./dayNameSequence";
import { LowercaseGreekLettersSequence } from "./lowercaseGreekLettersSequence";
import { LowercaseLettersSequence } from "./lowercaseLettersSequence";
import { MonthNamesSequence } from "./monthNamesSequence";
import { NatoPhoneticAlphabetSequence } from "./natoPhoneticAlphabetSequence";
import { NumberSequece } from "./numberSequence";
import { UppercaseGreekLettersSequence } from "./uppercaseGreekLettersSequence";
import { UppercaseLettersSequence } from "./uppercaseLettersSequence";

export const uppercaseLetterSequence = new UppercaseLettersSequence();
export const lowercaseLetterSequence = new LowercaseLettersSequence();
export const uppercaseGreekLetterSequence = new UppercaseGreekLettersSequence();
export const lowercaseGreekLetterSequence = new LowercaseGreekLettersSequence();
export const natoPhoneticAlphabetSequence = new NatoPhoneticAlphabetSequence();
export const longEnglishDayNamesSequence = new DayNamesSequence("en-US", "long");
export const shortEnglishDayNamesSequence = new DayNamesSequence("en-US", "short");
export const longCustomLocaleDayNamesSequence = new DayNamesSequence(undefined, "long");
export const shortCustomLocaleDayNamesSequence = new DayNamesSequence(undefined, "short");
export const longEnglishMonthNamesSequence = new MonthNamesSequence("en-US", "long");
export const shortEnglishMonthNamesSequence = new MonthNamesSequence("en-US", "short");
export const longCustomLocaleMonthNamesSequence = new MonthNamesSequence(undefined, "long");
export const shortCustomLocaleMonthNamesSequence = new MonthNamesSequence(undefined, "short");

export function getKnownStandardSequences(): ASequenceBase[] {
	return [
		uppercaseLetterSequence,
		lowercaseLetterSequence,
		uppercaseGreekLetterSequence,
		lowercaseGreekLetterSequence,
		natoPhoneticAlphabetSequence,

		new NumberSequece(NumeralSystem.Decimal, 1, 1),
		new NumberSequece(NumeralSystem.Decimal, undefined, 1),
		new NumberSequece(NumeralSystem.Decimal, 1, undefined),
		new NumberSequece(NumeralSystem.Decimal, undefined, undefined),

		new NumberSequece(NumeralSystem.Hexadecimal, 1, 1),
		new NumberSequece(NumeralSystem.Hexadecimal, undefined, 1),
		new NumberSequece(NumeralSystem.Hexadecimal, 1, undefined),
		new NumberSequece(NumeralSystem.Hexadecimal, undefined, undefined),

		new NumberSequece(NumeralSystem.Roman, 1, 1),
		new NumberSequece(NumeralSystem.Roman, undefined, 1),
		new NumberSequece(NumeralSystem.Roman, 1, undefined),
		new NumberSequece(NumeralSystem.Roman, undefined, undefined),

		longEnglishDayNamesSequence,
		shortEnglishDayNamesSequence,
		new DayNamesSequence("en-US", "narrow"),
		longCustomLocaleDayNamesSequence,
		shortCustomLocaleDayNamesSequence,
		new DayNamesSequence(undefined, "narrow"),

		longEnglishMonthNamesSequence,
		shortEnglishMonthNamesSequence,
		new MonthNamesSequence("en-US", "narrow"),
		longCustomLocaleMonthNamesSequence,
		shortCustomLocaleMonthNamesSequence,
		new MonthNamesSequence(undefined, "narrow"),
	];
};
