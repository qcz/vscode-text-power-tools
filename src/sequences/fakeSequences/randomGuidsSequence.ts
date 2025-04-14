import { v4 } from "uuid";
import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ParameterizedSequence } from "../sequenceBase";
import { EnsureAllParametersAreSetResult, EnsureParameterIsSetResult, StringIteratorGeneratorFunction, isSequenceErrorMessage } from "../sequenceTypes";

export type GeneratedGuidType = "noDashes" | "dashes" | "dashesAndBraces" | "cSharpGuidConstructor";
export const KNOWN_GUID_TYPES: GeneratedGuidType[] = ["noDashes", "dashes", "dashesAndBraces", "cSharpGuidConstructor"];

interface GuidTypeQuickPickItem extends vscode.QuickPickItem {
	type: GeneratedGuidType;
}

const FORMAT_NO_DASHES = vscode.l10n.t("No dashes");
const FORMAT_DASHES = vscode.l10n.t("Dashes");
const FORMAT_DASHES_AND_BRACES = vscode.l10n.t("Dashes and braces");
const FORMAT_CSHARP = vscode.l10n.t("C# Guid constructor");

interface SequenceGeneratorParameters {
	guidType: GeneratedGuidType;
}

export class RandomGuidsSequence extends ParameterizedSequence<SequenceGeneratorParameters> {
	public get name(): string {
		return this.guidType === "noDashes" ? vscode.l10n.t("Random UUIDs/GUIDs without dashes")
			: this.guidType === "dashes" ? vscode.l10n.t("Random UUIDs/GUIDs with dashes")
			: this.guidType === "dashesAndBraces" ? vscode.l10n.t("Random UUIDs/GUIDs with dashes and braces")
			: this.guidType === "cSharpGuidConstructor" ? vscode.l10n.t("Random UUIDs/GUIDs as a C# GUID constructor")
			: "";
	}

	public get icon(): string {
		return "symbol-module";
	}

	public get order(): number {
		return 10000;
	}

	public get sampleSize(): number {
		return 2;
	}

	constructor(
		private guidType: GeneratedGuidType | undefined
	) {
		const defaultParameters = {
			guidType: guidType
		};
		const sampleParameters = {
			guidType: guidType ?? "dashes"
		};

		super(defaultParameters, sampleParameters);
	}

	public createParameterizedGenerator(parameters: SequenceGeneratorParameters): StringIteratorGeneratorFunction {
		const self = this;
		const settings = getExtensionSettings();

		return function* (): IterableIterator<string> {
			while (true) {
				yield self.generateRandomItem(
					parameters.guidType,
					settings.insertUppercaseGuids
				);
			}
		};
	}

	public generateRandomItem(
		type: GeneratedGuidType,
		insertUppercaseGuids: boolean
	): string {
		let guid = v4();

		if (insertUppercaseGuids) {
			guid = guid.toUpperCase();
		}

		if (type === "noDashes") {
			guid = guid.replace(/[-]/g, "");
		} else if (type === "dashesAndBraces") {
			guid = `{${guid}}`;
		} else if (type === "cSharpGuidConstructor") {
			guid = `new Guid("${guid}");`;
		}

		return guid;
	}

	public async ensureAllParametersAreSet(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureAllParametersAreSetResult<SequenceGeneratorParameters>> {
		if (typeof this.guidType === "undefined") {
			const res = await this.askForGuidType(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return parameters as SequenceGeneratorParameters;
	}

	private askForGuidType(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
			const settings = getExtensionSettings();
			let sampleGuid = v4();
			if (settings.insertUppercaseGuids) {
				sampleGuid = sampleGuid.toUpperCase();
			}

			const qp = vscode.window.createQuickPick<GuidTypeQuickPickItem>();
			qp.items = [
				{ label: FORMAT_DASHES, description: sampleGuid, type: "dashes" },
				{ label: FORMAT_NO_DASHES, description: sampleGuid.replace(/[-]/g, ""), type: "noDashes" },
				{ label: FORMAT_DASHES_AND_BRACES, description: `{${sampleGuid}}`, type: "dashesAndBraces" },
				{ label: FORMAT_CSHARP, description: `new Guid("${sampleGuid}");`, type: "cSharpGuidConstructor" }
			];

			qp.onDidAccept(() => {
				if (!qp.activeItems.length) {
					resolve({ errorMessage: vscode.l10n.t("No UUID/GUID type selected.") });
					return;
				}


				parameters.guidType = qp.activeItems[0].type;

				qp.hide();
				qp.dispose();
				resolve(true);
			});
			qp.show();
		});
	}
}
