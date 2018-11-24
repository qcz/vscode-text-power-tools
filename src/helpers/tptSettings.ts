import * as vscode from "vscode";

export interface ITextPowerToolsSettings {
	caseSensitiveFiltering: boolean;
	defaultPadString: string | undefined;
	insertUppercaseHexNumbers: boolean;
}

export function getExtensionSettings(): ITextPowerToolsSettings {
	const vscConfig = vscode.workspace.getConfiguration("textPowerTools");
	
	return {
		caseSensitiveFiltering: vscConfig.get<boolean>("caseSensitiveFiltering", false),
		defaultPadString: vscConfig.get<string>("defaultPadString"),
		insertUppercaseHexNumbers: vscConfig.get<boolean>("insertUppercaseHexNumbers", true)
	};
}
