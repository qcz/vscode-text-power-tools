import * as vscode from "vscode";
import { SequenceGeneratorFromPredefinedArray } from "../sequenceBase";

export class LowercaseLettersSequence extends SequenceGeneratorFromPredefinedArray {
	public get name(): string {
		return vscode.l10n.t("Lowercase letters");
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
