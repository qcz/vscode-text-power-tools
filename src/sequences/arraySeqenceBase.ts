import { ASequenceBase } from "./sequenceBase";
import { StringIteratorGeneratorFunction } from "./sequenceTypes";

export abstract class AArraySequenceBase extends ASequenceBase {
	protected abstract get array(): string[];

	public async createStandardGenerator(): Promise<StringIteratorGeneratorFunction> {
		const arr = this.array;
		const fun = function* (): IterableIterator<string> {
			for (const ele of arr) {
				yield ele;
			}
		};
	
		return fun;
	}
}
