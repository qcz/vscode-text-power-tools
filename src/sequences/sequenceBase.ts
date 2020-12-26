export abstract class ASequenceBase {
	public abstract get name(): string;
	public abstract createGenerator(): () => IterableIterator<string>;

	public get sample(): string {
		const generator = this.createGenerator();
		const iterator = generator();

		const sampleItems: string[] = [];

		let i = 0;
		while (i < 5) {
			const nextItem = iterator.next();
			if (nextItem.done) {
				break;
			}

			sampleItems.push(nextItem.value);
			i++;
		}

		if (sampleItems.length === 0) {
			return "No samples available for this series – configuration may be invalid.";
		}

		return `Sample: ${sampleItems.join(", ")}`;
	}
}
