import faker from "faker";
import * as vscode from "vscode";
import { getHumanizedLanguageName } from "../../helpers/utils";
import { FakerSequenceBase } from "../sequenceBase";

export class FakeLastNamesSequence extends FakerSequenceBase {
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
