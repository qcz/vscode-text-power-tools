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

export const getKnownSequences = (): ASequenceBase[] => {
	return [
		new UppercaseLettersSequence(),
		new LowercaseLettersSequence(),
		new UppercaseGreekLettersSequence(),
		new LowercaseGreekLettersSequence(),
		new NatoPhoneticAlphabetSequence(),

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

		new DayNamesSequence("en-US", "long"),
		new DayNamesSequence("en-US", "short"),
		new DayNamesSequence("en-US", "narrow"),
		new DayNamesSequence(undefined, "long"),
		new DayNamesSequence(undefined, "short"),
		new DayNamesSequence(undefined, "narrow"),

		new MonthNamesSequence("en-US", "long"),
		new MonthNamesSequence("en-US", "short"),
		new MonthNamesSequence("en-US", "narrow"),
		new MonthNamesSequence(undefined, "long"),
		new MonthNamesSequence(undefined, "short"),
		new MonthNamesSequence(undefined, "narrow"),
	];
};
