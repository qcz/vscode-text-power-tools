import * as vscode from "vscode";
import { SequenceGeneratorFromPredefinedArray } from "../sequenceBase";

export class LowercaseGreekLettersSequence extends SequenceGeneratorFromPredefinedArray {
	public get name(): string {
		return vscode.l10n.t("Lowercase greek letters");
	}

	public get icon(): string {
		return "symbol-key";
	}

	public get array(): string[] {
		return [
			"α", "β", "γ", "δ", "ε", "ζ", "η", "θ",
			"ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π",
			"ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "q"
		];
	}
}
