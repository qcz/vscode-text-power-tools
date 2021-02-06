import faker from "faker";
import { AFakerSequenceBase } from "../fakerSequenceBase";

export class FakeLastNamesSequence extends AFakerSequenceBase {
	public get name(): string {
		return `${this.humanizedLanguageName} last names`;
	}

	public get icon(): string {
		return "account";
	}

	public generateFakerItem(): string {
		return faker.name.lastName();
	}
}
