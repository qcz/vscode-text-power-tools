export abstract class ASequenceBase {
	public abstract get name(): string;
	public abstract createGenerator(forSample: boolean): Promise<() => IterableIterator<string>>;
	public async ensureAllParametersAreSet(): Promise<void> {};

	public async getSample(): Promise<string> {
		const generator = await this.createGenerator(true);
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
