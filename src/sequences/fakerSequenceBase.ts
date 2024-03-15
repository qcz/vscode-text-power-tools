import faker from "faker";
import { ASequenceBase } from "./sequenceBase";
import { CreateSampleGeneratorResult, StringIteratorGeneratorFunction } from "./sequenceTypes";

export abstract class AFakerSequenceBase extends ASequenceBase {
	constructor(protected locale: string) {
		super();
	}

	protected abstract generateFakerItem(): string;

	public async createStandardGenerator(): Promise<() => IterableIterator<string>> {
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
