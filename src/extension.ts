"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { filterText, FilterSourceType, FilterType } from "./modules/filterText";
import { removeBlankLines } from "./modules/removeBlankLines";
import { removeDuplicates } from "./modules/removeDuplicates";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(vscode.commands.registerCommand("extension.filterLinesIncludingString", () =>
		filterText({ type: FilterType.Include, sourceType: FilterSourceType.String, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.filterLinesIncludingStringInNewEditor", () =>
		filterText({ type: FilterType.Include, sourceType: FilterSourceType.String, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.filterLinesMatchingRegex", () =>
		filterText({ type: FilterType.Include, sourceType: FilterSourceType.Regex, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.filterLinesMatchingRegexInNewEditor", () =>
		filterText({ type: FilterType.Include, sourceType: FilterSourceType.Regex, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.filterLinesNotIncludingString", () =>
		filterText({ type: FilterType.Exclude, sourceType: FilterSourceType.String, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.filterLinesNotIncludingStringInNewEditor", () =>
		filterText({ type: FilterType.Exclude, sourceType: FilterSourceType.String, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.filterLinesNotMatchingRegex", () =>
		filterText({ type: FilterType.Exclude, sourceType: FilterSourceType.Regex, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.filterLinesNotMatchingRegexInNewEditor", () =>
		filterText({ type: FilterType.Exclude, sourceType: FilterSourceType.Regex, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.removeDuplicates", () =>
		removeDuplicates()));
	context.subscriptions.push(vscode.commands.registerCommand("extension.removeBlankLines", () =>
		removeBlankLines({ onlySurplus: false })));
	context.subscriptions.push(vscode.commands.registerCommand("extension.removeSurplusBlankLines", () =>
		removeBlankLines({ onlySurplus: true })));
}

// this method is called when your extension is deactivated
export function deactivate() {
} 
