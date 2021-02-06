import { AArraySequenceBase } from "../arraySeqenceBase";

export class NatoPhoneticAlphabetSequence extends AArraySequenceBase {
	public get name(): string {
		return "NATO phonetic alphabet sequence items";
	}

	public get array(): string[] {
		return [
			"Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel",
			"India", "Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa",
			"Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey",
			"X-ray", "Yankee", "Zulu"
		];
	}
}
