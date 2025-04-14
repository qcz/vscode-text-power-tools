import * as vscode from "vscode";
import { SequenceGeneratorFromPredefinedArray } from "../sequenceBase";

export class NatoPhoneticAlphabetSequence extends SequenceGeneratorFromPredefinedArray {
	public get name(): string {
		return vscode.l10n.t("NATO phonetic alphabet sequence items");
	}

	public get icon(): string {
		return "megaphone";
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
