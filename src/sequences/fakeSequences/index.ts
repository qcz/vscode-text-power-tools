import * as vscode from "vscode";
import { compareNumbers } from "../../helpers/utils";
import { ASequenceBase } from "../sequenceBase";
import { FakeFirstNamesSequence } from "./fakeFirstNamesSequence";
import { FakeFullNamesSequence } from "./fakeFullNamesSequence";
import { FakeLastNamesSequence } from "./fakeLastNamesSequence";
import { LoremIpsumParagraphsSequence } from "./loremIpsumParagraphsSequence";
import { LoremIpsumSentencesSequence } from "./loremIpsumSentencesSequence";
import { RandomDecimalCharactersSequence } from "./randomDecimalCharactersSequence";
import { RandomFromUserInputSequence } from "./randomFromUserInputSequence";
import { RandomGuidsSequence } from "./randomGuidsSequence";
import { RandomHexCharactersSequence } from "./randomHexCharactersSequence";
import { IpAddressType, RandomIpAdressesSequence } from "./randomIpAdressesSequence";

export function getKnownFakeSequences(context: vscode.ExtensionContext): ASequenceBase[] {
	const ret: ASequenceBase[] = [];

	ret.push(new RandomFromUserInputSequence(context, undefined));
	ret.push(new RandomHexCharactersSequence(undefined));
	ret.push(new RandomDecimalCharactersSequence(undefined));
	ret.push(new RandomIpAdressesSequence(IpAddressType.Ipv4));
	ret.push(new RandomIpAdressesSequence(IpAddressType.Ipv6));
	ret.push(new RandomGuidsSequence("noDashes"));
	ret.push(new RandomGuidsSequence("dashes"));
	ret.push(new RandomGuidsSequence("dashesAndBraces"));
	ret.push(new RandomGuidsSequence("cSharpGuidConstructor"));
	ret.push(new LoremIpsumSentencesSequence());
	ret.push(new LoremIpsumParagraphsSequence());

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
