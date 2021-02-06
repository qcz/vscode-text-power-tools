import { v4 } from "node-uuid";
import * as vscode from "vscode";
import { getExtensionSettings } from "../../helpers/tptSettings";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, EnsureAllParametersAreSetResult, isSequenceErrorMessage, StringIteratorGeneratorFunction } from "../sequenceTypes";

export type GeneratedGuidType = "noDashes" | "dashes" | "dashesAndBraces" | "cSharpGuidConstructor";
export const KNOWN_GUID_TYPES: GeneratedGuidType[] = ["noDashes", "dashes", "dashesAndBraces", "cSharpGuidConstructor"];

interface GuidTypeQuickPickItem extends vscode.QuickPickItem {
	type: GeneratedGuidType;
}

const FORMAT_NO_DASHES = "No dashes";
const FORMAT_DASHES = "Dashes";
const FORMAT_DASHES_AND_BRACES = "Dashes and braces";
const FORMAT_CSHARP = "C# Guid constructor";

export class RandomGuidsSequence extends ASequenceBase {
	public get name(): string {
		const type = this.guidType == "noDashes" ? ` without dashes`
			: this.guidType == "dashes" ? ` with dashes`
			: this.guidType == "dashesAndBraces" ? ` with dashes and braces`
			: this.guidType == "cSharpGuidConstructor" ? ` as a C# GUID constructor`
			: "";
		return `Random UUIDs/GUIDs${type}`;
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
		super();
	}

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal(this.guidType);
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal(this.guidType);
	}

	public async createGeneratorFunctionInternal(guidType: GeneratedGuidType | undefined)
		: Promise<StringIteratorGeneratorFunction>
	{
		const self = this;
		const settings = getExtensionSettings();

		const fun = function* (): IterableIterator<string> {
			while (true) {
				yield self.generateRandomItem(
					guidType || "dashes",
					settings.insertUppercaseGuids
				);
			}
		};
	
		return fun;
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

	public async ensureAllParametersAreSet(): Promise<EnsureAllParametersAreSetResult> {
		if (typeof this.guidType === "undefined") {
			const res = await this.askForGuidType();
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return true;
	}

	private askForGuidType(): Promise<EnsureAllParametersAreSetResult> {
		return new Promise<EnsureAllParametersAreSetResult>((resolve) => {
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
					resolve({ errorMessage: "No UUID/GUID type selected." });
					return;
				}
				

				this.guidType = qp.activeItems[0].type;

				qp.hide();
				qp.dispose();
				resolve(true);
			});
			qp.show();
		});
	}
}
