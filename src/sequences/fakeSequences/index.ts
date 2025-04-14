import * as vscode from "vscode";
import { compareNumbers } from "../../helpers/utils";
import { NumeralSystem } from "../../interfaces";
import { SequenceBase } from "../sequenceBase";
import { FakeFirstNamesSequence } from "./fakeFirstNamesSequence";
import { FakeFullNamesSequence } from "./fakeFullNamesSequence";
import { FakeLastNamesSequence } from "./fakeLastNamesSequence";
import { LoremIpsumParagraphsSequence } from "./loremIpsumParagraphsSequence";
import { LoremIpsumSentencesSequence } from "./loremIpsumSentencesSequence";
import { WordsContainingRandomAlphanumericCharactersSequence, WordsContainingRandomAsciiCharactersSequence, WordsContainingRandomDecimalCharactersSequence, WordsContainingRandomHexCharactersSequence, WordsContainingRandomLettersSequence, WordsContainingRandomLowercaseLettersSequence, WordsContainingRandomUppercaseLettersSequence } from "./randomCharactersSequence";
import { RandomCoordinatesSequence } from "./randomCoordinatesSequence";
import { RandomFromUserInputSequence } from "./randomFromUserInputSequence";
import { RandomGuidsSequence } from "./randomGuidsSequence";
import { IpAddressType, RandomIpAdressesSequence } from "./randomIpAdressesSequence";
import { RandomNumberFromRangeSequence } from "./randomNumberFromRangeSequence";

export const randomDecimalNumberFromRangeSequence = new RandomNumberFromRangeSequence(NumeralSystem.Decimal, false);
export const randomRealNumberFromRangeSequence = new RandomNumberFromRangeSequence(NumeralSystem.Decimal, true);
export const randomHexadecimalNumberFromRangeSequence = new RandomNumberFromRangeSequence(NumeralSystem.Hexadecimal, false);
export const randomIpv4AddressesSequence = new RandomIpAdressesSequence(IpAddressType.Ipv4);
export const randomIpv6AddressesSequence = new RandomIpAdressesSequence(IpAddressType.Ipv6);
export const randomCoordinatesSequence = new RandomCoordinatesSequence();
export const randomEuropeanCoordinatesSequence = new RandomCoordinatesSequence("Europe");
export const randomNorthAmericanCoordinatesSequence = new RandomCoordinatesSequence("NorthAmerica");
export const randomAsianCoordinatesSequence = new RandomCoordinatesSequence("Asia");
export const loremIpsumSentencesSequence = new LoremIpsumSentencesSequence();
export const loremIpsumParagraphsSequence = new LoremIpsumParagraphsSequence();
export const wordsContainingRandomHexCharactersSequence = new WordsContainingRandomHexCharactersSequence();
export const wordsContainingRandomDecimalCharactersSequence = new WordsContainingRandomDecimalCharactersSequence();
export const wordsContainingRandomLowercaseLettersSequence = new WordsContainingRandomLowercaseLettersSequence();
export const wordsContainingRandomUppercaseLettersSequence = new WordsContainingRandomUppercaseLettersSequence();
export const wordsContainingRandomLettersSequence = new WordsContainingRandomLettersSequence();
export const wordsContainingRandomAlphanumericCharactersSequence = new WordsContainingRandomAlphanumericCharactersSequence();
export const wordsContainingRandomAsciiCharactersSequence = new WordsContainingRandomAsciiCharactersSequence();

export function getKnownFakeSequences(context: vscode.ExtensionContext): SequenceBase[] {
	const ret: SequenceBase[] = [];

	ret.push(new RandomFromUserInputSequence(context, undefined));
	ret.push(randomDecimalNumberFromRangeSequence);
	ret.push(randomRealNumberFromRangeSequence);
	ret.push(randomHexadecimalNumberFromRangeSequence);
	ret.push(wordsContainingRandomHexCharactersSequence);
	ret.push(wordsContainingRandomDecimalCharactersSequence);
	ret.push(wordsContainingRandomLettersSequence);
	ret.push(wordsContainingRandomUppercaseLettersSequence);
	ret.push(wordsContainingRandomLettersSequence);
	ret.push(wordsContainingRandomAlphanumericCharactersSequence);
	ret.push(wordsContainingRandomAsciiCharactersSequence);
	ret.push(randomIpv4AddressesSequence);
	ret.push(randomIpv6AddressesSequence);
	ret.push(new RandomGuidsSequence("noDashes"));
	ret.push(new RandomGuidsSequence("dashes"));
	ret.push(new RandomGuidsSequence("dashesAndBraces"));
	ret.push(new RandomGuidsSequence("cSharpGuidConstructor"));
	ret.push(randomCoordinatesSequence);
	ret.push(new RandomCoordinatesSequence("Africa"));
	ret.push(randomAsianCoordinatesSequence);
	ret.push(randomEuropeanCoordinatesSequence);
	ret.push(randomNorthAmericanCoordinatesSequence);
	ret.push(new RandomCoordinatesSequence("SouthAmerica"));
	ret.push(loremIpsumSentencesSequence);
	ret.push(loremIpsumParagraphsSequence);

	for (const languageCode of ["de", "en", "fr", "hu"]) {
		ret.push(new FakeFirstNamesSequence(languageCode));
		ret.push(new FakeLastNamesSequence(languageCode));
		ret.push(new FakeFullNamesSequence(languageCode));
	}

	ret.sort((a, b) => {
		const pos = compareNumbers(a.order, b.order);

		if (pos !== 0) {
			return pos;
		}

		return a.name.localeCompare(b.name);
	});

	return ret;
};
