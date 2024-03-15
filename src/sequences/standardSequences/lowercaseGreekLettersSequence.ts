import * as vscode from "vscode";
import { AArraySequenceBase } from "../arraySeqenceBase";

export class LowercaseGreekLettersSequence extends AArraySequenceBase {
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
