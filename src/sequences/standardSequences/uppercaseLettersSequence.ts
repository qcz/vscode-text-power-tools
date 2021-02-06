import { AArraySequenceBase } from "../arraySeqenceBase";

export class UppercaseLettersSequence extends AArraySequenceBase {
	public get name(): string {
		return "Uppercase letters";
	}

	public get icon(): string {
		return "preserve-case";
	}

	public get array(): string[] {
		return [
			"A", "B", "C", "D", "E", "F", "G", "H", "I",
			"J", "K", "L", "M", "N", "O", "P", "Q", "R",
			"S", "T", "U", "V", "W", "X", "Y", "Z"
		];
	}
}
