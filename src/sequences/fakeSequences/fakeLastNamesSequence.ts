import faker from "faker";
import { AFakerSequenceBase } from "../fakerSequenceBase";

export class FakeLastNamesSequence extends AFakerSequenceBase {
	public get name(): string {
		return `${this.humanizedLanguageName} last names`;
	}

	public generateFakerItem(): string {
		return faker.name.lastName();
	}
}
