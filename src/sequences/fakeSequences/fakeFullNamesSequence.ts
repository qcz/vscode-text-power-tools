import faker from "faker";
import * as vscode from "vscode";
import { getHumanizedLanguageName } from "../../helpers/utils";
import { FakerSequenceBase } from "../sequenceBase";

export class FakeFullNamesSequence extends FakerSequenceBase {
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
