import * as vscode from "vscode";

export const CANNOT_SELECT_MORE_THAN_ONE_LINE = vscode.l10n.t("This function does not support selection of more than one line.");
const VSCODE_SIZE_ISSUE_LINK = "https://github.com/Microsoft/vscode/issues/31078";
export const NO_ACTIVE_EDITOR: string = vscode.l10n.t("This function requires an active editor.")
	+ "\n\n"
	+ vscode.l10n.t(
		"If you have an open editor, the file may be too large. VS Code hides these files from extensions like *Text Power Tools*. Vote on [this issue]({0}) to make this limit lifted.",
		VSCODE_SIZE_ISSUE_LINK
	);
export const NOTHING_IS_SELECTED = vscode.l10n.t("This function does not work without selection.");
export const SELECT_MORE_THAN_ONE_LINE = vscode.l10n.t("This function works if nothing or multiple lines are selected.");
export const COMMAND_CALL_ERROR = vscode.l10n.t("Internal error: Command called in an unsupported configuration: ");
