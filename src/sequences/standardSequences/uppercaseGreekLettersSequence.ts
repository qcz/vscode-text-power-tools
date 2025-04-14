import * as vscode from "vscode";
import { SequenceGeneratorFromPredefinedArray } from "../sequenceBase";

export class UppercaseGreekLettersSequence extends SequenceGeneratorFromPredefinedArray {
	public get name(): string {
		return vscode.l10n.t("Uppercase greek letters");
	}

	public get icon(): string {
		return "preserve-case";
	}

	public get array(): string[] {
		return [
			"Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ",
			"Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π",
			"Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω"
		];
	}
}
