import { ASequenceBase } from "./sequenceBase";

export abstract class AArraySequenceBase extends ASequenceBase {
	protected abstract get array(): string[];

	public createGenerator(): () => IterableIterator<string> {
		const arr = this.array;
		const fun = function* (): IterableIterator<string> {
			for (const ele of arr) {
				yield ele;
			}
		};
	
		return fun;
	}
}
