import * as vscode from "vscode";
import { showHistoryQuickPick } from "../../helpers/vsCodeHelpers";
import { ParameterizedSequence } from "../sequenceBase";
import { EnsureAllParametersAreSetResult, EnsureParameterIsSetResult, StringIteratorGeneratorFunction, isSequenceErrorMessage } from "../sequenceTypes";

interface SequenceGeneratorParameters {
	inputList: string[];
}

export class RandomFromUserInputSequence extends ParameterizedSequence<SequenceGeneratorParameters> {
	constructor(
		protected context: vscode.ExtensionContext,
		rawInputList: string | undefined
	) {
		const inputList: string[] | undefined = typeof rawInputList  !== "undefined"
			? rawInputList
				.split(",")
				.map(x => x.trim())
				.filter(x => x !== "")
			: undefined;

		const defaultParameters =  {
			inputList: inputList
		}

		const sampleParameters = {
			inputList: inputList ?? ["foo", "bar", "quux"]
		};

		super(defaultParameters, sampleParameters);
	}

	public get icon(): string {
		return "record-keys";
	}

	public get order(): number {
		return 0;
	}

	public get name(): string {
		return vscode.l10n.t("Random items from user input");
	}

	public createParameterizedGenerator(parameters: SequenceGeneratorParameters): StringIteratorGeneratorFunction {
		var self = this;
		return function* (): IterableIterator<string> {
			if (parameters.inputList.length === 0) {
				return;
			}

			while (true) {
				yield self.generateRandomItem(parameters.inputList);
			}
		};
	}

	public generateRandomItem(inputList: string[]): string {
		const index = Math.floor(Math.random() * inputList.length);
		return inputList[index];
	}

	public async ensureAllParametersAreSet(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureAllParametersAreSetResult<SequenceGeneratorParameters>> {
		if (typeof parameters.inputList === "undefined") {
			const res = await this.askForInputList(parameters);
			if (isSequenceErrorMessage(res)) {
				return res;
			}
		}

		return parameters as SequenceGeneratorParameters;
	}

	private askForInputList(parameters: Partial<SequenceGeneratorParameters>): Promise<EnsureParameterIsSetResult> {
		return new Promise<EnsureParameterIsSetResult>((resolve) => {
			showHistoryQuickPick({
				context: this.context,
				title: vscode.l10n.t("Please enter the comma separated list of items"),
				historyStateKey: "generateItems-fromRandomUserInput",
				onDidAccept: async (input: string) => {
					if (!input || input.split(",").every(x => x.trim() === "")) {
						resolve({ errorMessage: vscode.l10n.t("No items entered.") });
					}

					parameters.inputList = input
						.split(",")
						.map(x => x.trim())
						.filter(x => x !== "");

					resolve(true);
				}
			});
		});
	}
}
