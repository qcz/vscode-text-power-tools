import { AArraySequenceBase } from "../arraySeqenceBase";

export class LowercaseLettersSequence extends AArraySequenceBase {
	public get name(): string {
		return "Lowercase letters";
	}

	public get icon(): string {
		return "symbol-key";
	}

	public get array(): string[] {
		return [
			"a", "b", "c", "d", "e", "f", "g", "h", "i",
			"j", "k", "l", "m", "n", "o", "p", "q", "r",
			"s", "t", "u", "v", "w", "x", "y", "z"
		];
	}
}
