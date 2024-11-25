import faker from "faker";
import * as vscode from "vscode";
import { CreateGeneratorResult, CreateSampleGeneratorResult, EnsureAllParametersAreSetResult, StringIteratorGeneratorFunction, isSequenceErrorMessage } from "./sequenceTypes";

export abstract class SequenceBase {
	public abstract get name(): string;

	public get icon(): string {
		return "play";
	}

	public get order(): number {
		return 1000;
	}
	public get sampleSize(): number {
		return 5;
	}

	public abstract createGenerator(): Promise<CreateGeneratorResult>;
	public async createSampleGenerator(): Promise<CreateGeneratorResult | null> {
		return null;
	}

	public async getSample(): Promise<string> {
		let generator = await this.createSampleGenerator();
		if (generator === null) {
			generator = await this.createGenerator();
		}

		if (isSequenceErrorMessage(generator)) {
			return vscode.l10n.t("Generator returned an error: {0}", generator.errorMessage);
		}

		const iterator = generator();

		const sampleItems: string[] = [];

		let i = 0;
		let hasMoreItems = true;
		while (i < this.sampleSize) {
			const nextItem = iterator.next();
			if (nextItem.done) {
				hasMoreItems = false;
				break;
			}

			sampleItems.push(nextItem.value);
			i++;
		}

		if (sampleItems.length === 0) {
			return vscode.l10n.t("No samples available for this series – configuration may be invalid.");
		}

		const moreItemsAvailable = hasMoreItems ? "…" : "";
		return vscode.l10n.t("Sample: {0}", `${sampleItems.join("', '")}'${moreItemsAvailable}`);
	}
}

export abstract class SequenceGeneratorFromPredefinedArray extends SequenceBase {
	protected abstract get array(): string[];

	public async createGenerator(): Promise<StringIteratorGeneratorFunction> {
		const arr = this.array;
		const fun = function* (): IterableIterator<string> {
			for (const ele of arr) {
				yield ele;
			}
		};

		return fun;
	}
}

export abstract class ParameterizedSequence<T> extends SequenceBase {
	protected defaultParameters: Partial<T>;
	protected sampleParameters: T;

	constructor(defaultParameters: Partial<T>, sampleParameters: T) {
		super();

		this.defaultParameters = defaultParameters;
		this.sampleParameters = sampleParameters;
	}

	public abstract ensureAllParametersAreSet(parameters: Partial<T>): Promise<EnsureAllParametersAreSetResult<T>>;

	public async createGenerator(): Promise<CreateGeneratorResult> {
		const ensureResult = await this.ensureAllParametersAreSet({ ...this.defaultParameters });
		if (isSequenceErrorMessage(ensureResult)) {
			return ensureResult;
		}

		return this.createParameterizedGenerator(ensureResult);
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return await this.createParameterizedGenerator({ ...this.sampleParameters });
	}

	protected abstract createParameterizedGenerator(parameters: T): CreateGeneratorResult;
}

export abstract class FakerSequenceBase extends SequenceBase {
	constructor(protected locale: string) {
		super();
	}

	protected abstract generateFakerItem(): string;

	public async createGenerator(): Promise<() => IterableIterator<string>> {
		return this.createGeneratorFunctionInternal(() => {
			faker.setLocale(this.locale);
			faker.seed(Math.random());
		});
	}

	public async createSampleGenerator(): Promise<CreateSampleGeneratorResult> {
		return this.createGeneratorFunctionInternal(() => {
			faker.setLocale(this.locale);
			faker.seed(42);
		});
	}

	public async createGeneratorFunctionInternal(initFaker: () => void): Promise<StringIteratorGeneratorFunction> {
		const self = this;

		const fun = function* (): IterableIterator<string> {
			initFaker();

			while (true) {
				yield self.generateFakerItem();
			}
		};

		return fun;
	}
}
