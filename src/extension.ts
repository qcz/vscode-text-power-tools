"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { countOccurrences, extractInfo, FilterSourceType, filterText, FilterType, pad, PadDirection, removeBlankLines, removeDuplicates } from "./modules";
import { insertNumbers, InsertNumbersNumberFormat } from "./modules/insertNumbers";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesIncludingString", () =>
		filterText(context, { type: FilterType.Include, sourceType: FilterSourceType.String, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesIncludingStringToNewEditor", () =>
		filterText(context, { type: FilterType.Include, sourceType: FilterSourceType.String, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesMatchingRegex", () =>
		filterText(context, { type: FilterType.Include, sourceType: FilterSourceType.Regex, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesMatchingRegexToNewEditor", () =>
		filterText(context, { type: FilterType.Include, sourceType: FilterSourceType.Regex, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesNotIncludingString", () =>
		filterText(context, { type: FilterType.Exclude, sourceType: FilterSourceType.String, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesNotIncludingStringToNewEditor", () =>
		filterText(context, { type: FilterType.Exclude, sourceType: FilterSourceType.String, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesNotMatchingRegex", () =>
		filterText(context, { type: FilterType.Exclude, sourceType: FilterSourceType.Regex, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesNotMatchingRegexToNewEditor", () =>
		filterText(context, { type: FilterType.Exclude, sourceType: FilterSourceType.Regex, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.extractInformation", () =>
		extractInfo(context, { inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.extractInformationToNewEditor", () =>
		extractInfo(context, { inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.countOccurrences", () =>
		countOccurrences({ inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.countOccurrencesToNewEditor", () =>
		countOccurrences({ inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.removeDuplicates", () =>
		removeDuplicates()));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.removeBlankLines", () =>
		removeBlankLines({ onlySurplus: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.removeSurplusBlankLines", () =>
		removeBlankLines({ onlySurplus: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDecimalNumbers", () =>
		insertNumbers({ numberFormat: InsertNumbersNumberFormat.Decimal, askForIncrements: false, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDecimalNumbersStartingAt", () =>
		insertNumbers({ numberFormat: InsertNumbersNumberFormat.Decimal, askForIncrements: false, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDecimalNumbersWithIncrements", () =>
		insertNumbers({ numberFormat: InsertNumbersNumberFormat.Decimal, askForIncrements: true, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDecimalNumbersWithIncrementsStartingAt", () =>
		insertNumbers({ numberFormat: InsertNumbersNumberFormat.Decimal, askForIncrements: true, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertHexNumbers", () =>
		insertNumbers({ numberFormat: InsertNumbersNumberFormat.Hex, askForIncrements: false, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertHexNumbersStartingAt", () =>
		insertNumbers({ numberFormat: InsertNumbersNumberFormat.Hex, askForIncrements: false, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertHexNumbersWithIncrements", () =>
		insertNumbers({ numberFormat: InsertNumbersNumberFormat.Hex, askForIncrements: true, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertHexNumbersWithIncrementsStartingAt", () =>
		insertNumbers({ numberFormat: InsertNumbersNumberFormat.Hex, askForIncrements: true, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.padStart", () =>
		pad({ direction: PadDirection.Start, askForPadCharacters: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.padStartWithCustomString", () =>
		pad({ direction: PadDirection.Start, askForPadCharacters: true })));
		context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.padEnd", () =>
		pad({ direction: PadDirection.End, askForPadCharacters: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.padEndWithCustomString", () =>
		pad({ direction: PadDirection.End, askForPadCharacters: true })));
}

// this method is called when your extension is deactivated
export function deactivate() {
} 
