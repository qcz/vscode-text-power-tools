import * as vscode from "vscode";

export interface ITextPowerToolsSettings {
	caseSensitiveFiltering: boolean;
}

export function getExtensionSettings(): ITextPowerToolsSettings {
	const vscConfig = vscode.workspace.getConfiguration("textPowerTools");
	
	return {
		caseSensitiveFiltering: vscConfig.get<boolean>("caseSensitiveFiltering", false)
	};
}
