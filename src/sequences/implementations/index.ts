import { ASequenceBase } from "../sequenceBase";
import { DayNamesSequence } from "./dayNameSequence";
import { LowercaseGreekLettersSequence } from "./lowercaseGreekLettersSequence";
import { LowercaseLettersSequence } from "./lowercaseLettersSequence";
import { MonthNamesSequence } from "./monthNamesSequence";
import { NatoPhoneticAlphabetSequence } from "./natoPhoneticAlphabetSequence";
import { UppercaseGreekLettersSequence } from "./uppercaseGreekLettersSequence";
import { UppercaseLettersSequence } from "./uppercaseLettersSequence";

export const knownSequences: ASequenceBase[] = [
	new UppercaseLettersSequence(),
	new LowercaseLettersSequence(),
	new UppercaseGreekLettersSequence(),
	new LowercaseGreekLettersSequence(),
	new NatoPhoneticAlphabetSequence(),

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
