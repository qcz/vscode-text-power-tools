import faker from "faker";
import * as vscode from "vscode";
import { getHumanizedLanguageName } from "../../helpers/utils";
import { AFakerSequenceBase } from "../fakerSequenceBase";

export class FakeLastNamesSequence extends AFakerSequenceBase {
	public get name(): string {
		return vscode.l10n.t("{0} last names", getHumanizedLanguageName(this.locale));
	}

	public get icon(): string {
		return "account";
	}

	public generateFakerItem(): string {
		return faker.name.lastName();
	}
}
