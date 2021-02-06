import faker from "faker";
import { AFakerSequenceBase } from "../fakerSequenceBase";

export class FakeFirstNamesSequence extends AFakerSequenceBase {
	public get name(): string {
		return `${this.humanizedLanguageName} first names`;
	}

	public get icon(): string {
		return "account";
	}

	public generateFakerItem(): string {
		return faker.name.firstName();
	}
}
