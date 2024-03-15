import * as vscode from "vscode";
import { AArraySequenceBase } from "../arraySeqenceBase";

export class UppercaseGreekLettersSequence extends AArraySequenceBase {
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
