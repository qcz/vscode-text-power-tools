import faker from "faker";
import { AFakerSequenceBase } from "../fakerSequenceBase";

export class FakeFullNamesSequence extends AFakerSequenceBase {
	public get name(): string {
		return `${this.humanizedLanguageName} full names`;
	}

	public get sampleSize(): number {
		return 3;
	}

	public generateFakerItem(): string {
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();

		if (this.locale === "hu") {
			return `${lastName} ${firstName}`;
		}

		return `${firstName} ${lastName}`;
	}
}
