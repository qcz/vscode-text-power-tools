import * as vscode from "vscode";
import { SequenceGeneratorFromPredefinedArray } from "../sequenceBase";

export class UppercaseLettersSequence extends SequenceGeneratorFromPredefinedArray {
	public get name(): string {
		return vscode.l10n.t("Uppercase letters");
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
