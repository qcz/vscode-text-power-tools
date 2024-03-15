import faker from "faker";
import * as vscode from "vscode";
import { getHumanizedLanguageName } from "../../helpers/utils";
import { AFakerSequenceBase } from "../fakerSequenceBase";

export class FakeFullNamesSequence extends AFakerSequenceBase {
	public get name(): string {
		return vscode.l10n.t("{0} full names", getHumanizedLanguageName(this.locale));
	}

	public get icon(): string {
		return "account";
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
