import * as vscode from "vscode";
import { showHistoryQuickPick } from "../../helpers/vsCodeHelpers";
import { ASequenceBase } from "../sequenceBase";
import { CreateSampleGeneratorResult, EnsureAllParametersAreSetResult, isSequenceErrorMessage, StringIteratorGeneratorFunction } from "../sequenceTypes";

export class RandomFromUserInputSequence extends ASequenceBase {
	constructor(
		private context: vscode.ExtensionContext,
		private rawInputList: string | undefined
	) {
		super();
	}

	public get icon(): string {
		return "record-keys";
	}

	public get order(): number {
		return 0;
	}

	public get name(): string {
		return "Random items from user input";
	}

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal(this.rawInputList);
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal("foo,bar,quux");
	}

	public async createGeneratorFunctionInternal(rawInputList: string | undefined)
		: Promise<StringIteratorGeneratorFunction> {
		var self = this;
		const fun = function* (): IterableIterator<string> {
			const inputList: string[] = (rawInputList ?? "")
				.split(",")
				.map(x => x.trim())
				.filter(x => x !== "");

			if (inputList.length === 0) {
				return;
			}

			while (true) {
				yield self.generateRandomItem(inputList);
			}
		};

		return fun;
	}

	public generateRandomItem(inputList: string[]): string {
		const index = Math.floor(Math.random() * inputList.length);
		return inputList[index];
	}

	public async ensureAllParametersAreSet(): Promise<EnsureAllParametersAreSetResult> {
		if (typeof this.rawInputList === "undefined") {
			const res = await this.askForInputList();
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return true;
	}

	private askForInputList(): Promise<EnsureAllParametersAreSetResult> {
		return new Promise<EnsureAllParametersAreSetResult>((resolve) => {
			showHistoryQuickPick({
				context: this.context,
				title: "Please enter the comma separated list of items",
				historyStateKey: "generateItems-fromRandomUserInput",
				onDidAccept: async (input: string) => {
					if (!input || input.split(",").every(x => x.trim() === "")) {
						resolve({ errorMessage: "No items entered." });
					}

					this.rawInputList = input;
					resolve(true);
				}
			});
		});
	}
}
