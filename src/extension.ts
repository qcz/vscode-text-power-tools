"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { NumberArithmetic, NumeralSystem } from "./interfaces";
import { ASK_SPLIT_CHARACTER_FROM_USER, Base4EncodingDirection, ChangeCaseType, FilterSourceType, FilterType, InsertableStuff, LineNumberType, PadDirection, runBase64EncodingCommand, runChangeCaseCommand, runConvertNumberCommand, runConvertToZalgoCommand, runCopySelectionsToNewEditorCommand, runCountOccurrencesCommand, runExtractInfoCommand, runFilterTextCommand, runFormatContentAsTableCommand, runInsertLineNumbersCommand, runInsertNumbersCommand, runInsertStuffCommand, runModifyTextEncodingCommand, runPadCommand, runRemoveBlankLinesCommand, runRemoveControlCharactersCommand, runRemoveDuplicatesCommand, runSetTextSlotContentCommand, runpasteTextSlotCommand, TextEncodingDirection, TextEncodingType, ZalgificationIntensity, runInsertPredefinedSeriesCommand as runInsertPredefinedSequenceCommand, InsertableSeries, runSortCommand, SortMethod } from "./modules";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesIncludingString", () =>
		runFilterTextCommand(context, { type: FilterType.Include, sourceType: FilterSourceType.String, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesIncludingStringToNewEditor", () =>
		runFilterTextCommand(context, { type: FilterType.Include, sourceType: FilterSourceType.String, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesMatchingRegex", () =>
		runFilterTextCommand(context, { type: FilterType.Include, sourceType: FilterSourceType.Regex, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesMatchingRegexToNewEditor", () =>
		runFilterTextCommand(context, { type: FilterType.Include, sourceType: FilterSourceType.Regex, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesNotIncludingString", () =>
		runFilterTextCommand(context, { type: FilterType.Exclude, sourceType: FilterSourceType.String, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesNotIncludingStringToNewEditor", () =>
		runFilterTextCommand(context, { type: FilterType.Exclude, sourceType: FilterSourceType.String, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesNotMatchingRegex", () =>
		runFilterTextCommand(context, { type: FilterType.Exclude, sourceType: FilterSourceType.Regex, inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.filterLinesNotMatchingRegexToNewEditor", () =>
		runFilterTextCommand(context, { type: FilterType.Exclude, sourceType: FilterSourceType.Regex, inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.extractInformation", () =>
		runExtractInfoCommand(context, { inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.extractInformationToNewEditor", () =>
	runExtractInfoCommand(context, { inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.countOccurrences", () =>
		runCountOccurrencesCommand({ inNewEditor: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.countOccurrencesToNewEditor", () =>
		runCountOccurrencesCommand({ inNewEditor: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.removeDuplicates", () =>
		runRemoveDuplicatesCommand()));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.removeBlankLines", () =>
		runRemoveBlankLinesCommand({ onlySurplus: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.removeSurplusBlankLines", () =>
		runRemoveBlankLinesCommand({ onlySurplus: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.removeControlCharacters", () =>
		runRemoveControlCharactersCommand()));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDecimalNumbers", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Decimal, askForIncrements: false, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDecimalNumbersStartingAt", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Decimal, askForIncrements: false, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDecimalNumbersWithIncrements", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Decimal, askForIncrements: true, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDecimalNumbersWithIncrementsStartingAt", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Decimal, askForIncrements: true, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertHexNumbers", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Hexadecimal, askForIncrements: false, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertHexNumbersStartingAt", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Hexadecimal, askForIncrements: false, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertHexNumbersWithIncrements", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Hexadecimal, askForIncrements: true, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertHexNumbersWithIncrementsStartingAt", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Hexadecimal, askForIncrements: true, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertRomanNumerals", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Roman, askForIncrements: false, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertRomanNumeralsStartingAt", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Roman, askForIncrements: false, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertRomanNumeralsWithIncrements", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Roman, askForIncrements: true, askForStartingNumber: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertRomanNumeralsWithIncrementsStartingAt", () =>
		runInsertNumbersCommand({ numeralSystem: NumeralSystem.Roman, askForIncrements: true, askForStartingNumber: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertLineNumbers", () =>
		runInsertLineNumbersCommand({ type: LineNumberType.Real, padWithZero: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertLineNumbersFixedLength", () =>
		runInsertLineNumbersCommand({ type: LineNumberType.Real, padWithZero: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertRelativeLineNumbers", () =>
		runInsertLineNumbersCommand({ type: LineNumberType.Relative, padWithZero: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertRelativeLineNumbersFixedLength", () =>
		runInsertLineNumbersCommand({ type: LineNumberType.Relative, padWithZero: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.UserSelectionOfStandardSeries })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.generateFakeData", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.UserSelectionOfFakeSeries })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertLowercaseLetterSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.LowercaseLetters })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertUppercaseLetterSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.UppercaseLetters })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertLowercaseGreekLetterSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.LowercaseGreekLetters })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertUppercaseGreekLetterSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.UppercaseGreekLetters })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertNatoPhoneticAlphabetSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.NatoPhoneticAlphabet })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertLongEnglishMonthNamesSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.LongEnglishMonthNames })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertShortEnglishMonthNamesSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.ShortEnglishMonthNames })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertLongLocaleMonthNamesSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.LongLocaleMonthNames })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertShortLocaleMonthNamesSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.ShortLocaleMonthNames })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertLongEnglishDayNamesSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.LongEnglishDayNames })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertShortEnglishDayNamesSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.ShortEnglishDayNames })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertLongLocaleDayNamesSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.LongLocaleDayNames })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertShortLocaleDayNamesSequence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.ShortLocaleDayNames })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertFullFilePath", () =>
		runInsertStuffCommand({ what: InsertableStuff.FullFilePath })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertDirectoryPath", () =>
		runInsertStuffCommand({ what: InsertableStuff.DirectoryPath })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertFileName", () =>
		runInsertStuffCommand({ what: InsertableStuff.FileName })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.insertUnixTimestamp", () =>
		runInsertStuffCommand({ what: InsertableStuff.UnixTimestamp })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.padStart", () =>
		runPadCommand({ direction: PadDirection.Start, askForPadCharacters: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.padStartWithCustomString", () =>
		runPadCommand({ direction: PadDirection.Start, askForPadCharacters: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.padEnd", () =>
		runPadCommand({ direction: PadDirection.End, askForPadCharacters: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.padEndWithCustomString", () =>
		runPadCommand({ direction: PadDirection.End, askForPadCharacters: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.formatContentAsTableByTabulator", () =>
		runFormatContentAsTableCommand({splitChar: "\t", padAlignChar: false})));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.formatContentAsTableBySemicolon", () =>
		runFormatContentAsTableCommand({splitChar: ";", padAlignChar: false})));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.formatContentAsTableByComma", () =>
		runFormatContentAsTableCommand({splitChar: ",", padAlignChar: false})));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.formatContentAsTableByPipe", () =>
		runFormatContentAsTableCommand({splitChar: "|", padAlignChar: false})));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.formatContentAsTableByCustomCharacter", () =>
		runFormatContentAsTableCommand({splitChar: ASK_SPLIT_CHARACTER_FROM_USER, padAlignChar: false})));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.formatContentAsTableBySemicolonWithPadding", () =>
		runFormatContentAsTableCommand({splitChar: ";", padAlignChar: true})));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.formatContentAsTableByPipeWithPadding", () =>
		runFormatContentAsTableCommand({splitChar: "|", padAlignChar: true})));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.formatContentAsTableByCustomCharacterWithPadding", () =>
		runFormatContentAsTableCommand({splitChar: ASK_SPLIT_CHARACTER_FROM_USER, padAlignChar: true})));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.generateRandomGuids", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.RandomGuids })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.generateLoremIpsumSentence", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.LoremIpsumSentences })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.generateLoremIpsumParagraph", () =>
		runInsertPredefinedSequenceCommand({ series: InsertableSeries.LoremIpsumParagraphs })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.changeCaseToCamelCase", () =>
		runChangeCaseCommand({ type: ChangeCaseType.CamelCase })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.changeCaseToPascalCase", () =>
		runChangeCaseCommand({ type: ChangeCaseType.PascalCase })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.changeCaseToSnakeCase", () =>
		runChangeCaseCommand({ type: ChangeCaseType.SnakeCase })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.changeCaseToDashCase", () =>
		runChangeCaseCommand({ type: ChangeCaseType.DashCase })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.changeCaseToConstantCase", () =>
		runChangeCaseCommand({ type: ChangeCaseType.ConstantCase })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.changeCaseToDotCase", () =>
		runChangeCaseCommand({ type: ChangeCaseType.DotCase })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.changeCaseToSwapCase", () =>
		runChangeCaseCommand({ type: ChangeCaseType.SwapCase })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.copySelectionsToNewEditor", () =>
		runCopySelectionsToNewEditorCommand()));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertHexadecimalNumbersToDecimal", () =>
		runConvertNumberCommand({ source: NumeralSystem.Hexadecimal, target: NumeralSystem.Decimal })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertHexadecimalNumbersToDecimal8bit", () =>
		runConvertNumberCommand({ source: NumeralSystem.Hexadecimal, target: NumeralSystem.Decimal, arithmetic: NumberArithmetic.EightBit })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertHexadecimalNumbersToDecimal16bit", () =>
		runConvertNumberCommand({ source: NumeralSystem.Hexadecimal, target: NumeralSystem.Decimal, arithmetic: NumberArithmetic.SixteenBit })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertHexadecimalNumbersToDecimal32bit", () =>
		runConvertNumberCommand({ source: NumeralSystem.Hexadecimal, target: NumeralSystem.Decimal, arithmetic: NumberArithmetic.ThirtyTwoBit })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertHexadecimalNumbersToDecimal64bit", () =>
		runConvertNumberCommand({ source: NumeralSystem.Hexadecimal, target: NumeralSystem.Decimal, arithmetic: NumberArithmetic.SixtyFourBit })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertDecimalNumbersToHexadecimal", () =>
		runConvertNumberCommand({ source: NumeralSystem.Decimal, target: NumeralSystem.Hexadecimal })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertDecimalNumbersToHexadecimal8bit", () =>
		runConvertNumberCommand({ source: NumeralSystem.Decimal, target: NumeralSystem.Hexadecimal, arithmetic: NumberArithmetic.EightBit })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertDecimalNumbersToHexadecimal16bit", () =>
		runConvertNumberCommand({ source: NumeralSystem.Decimal, target: NumeralSystem.Hexadecimal, arithmetic: NumberArithmetic.SixteenBit })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertDecimalNumbersToHexadecimal32bit", () =>
		runConvertNumberCommand({ source: NumeralSystem.Decimal, target: NumeralSystem.Hexadecimal, arithmetic: NumberArithmetic.ThirtyTwoBit })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertDecimalNumbersToHexadecimal64bit", () =>
		runConvertNumberCommand({ source: NumeralSystem.Decimal, target: NumeralSystem.Hexadecimal, arithmetic: NumberArithmetic.SixtyFourBit })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertToZalgoUltraLight", () =>
		runConvertToZalgoCommand({ intensity: ZalgificationIntensity.UltraLight })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertToZalgoLight", () =>
		runConvertToZalgoCommand({ intensity: ZalgificationIntensity.Light })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertToZalgoMedium", () =>
		runConvertToZalgoCommand({ intensity: ZalgificationIntensity.Medium })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.convertToZalgoHeavy", () =>
		runConvertToZalgoCommand({ intensity: ZalgificationIntensity.Heavy })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.urlEncodeText", () =>
		runModifyTextEncodingCommand({ type: TextEncodingType.UrlEncoding, direction: TextEncodingDirection.Encode })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.urlDecodeText", () =>
		runModifyTextEncodingCommand({ type: TextEncodingType.UrlEncoding, direction: TextEncodingDirection.Decode })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.encodeHtmlEntities", () =>
		runModifyTextEncodingCommand({ type: TextEncodingType.HtmlEntityEncoding, direction: TextEncodingDirection.Encode })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.encodeHtmlEntitiesWithNonAscii", () =>
		runModifyTextEncodingCommand({ type: TextEncodingType.HtmlEntityEncodingWithNonAscii, direction: TextEncodingDirection.Encode })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.decodeHtmlEntities", () =>
		runModifyTextEncodingCommand({ type: TextEncodingType.HtmlEntityEncoding, direction: TextEncodingDirection.Decode })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.encodeXmlEntities", () =>
		runModifyTextEncodingCommand({ type: TextEncodingType.XmlEntityEncoding, direction: TextEncodingDirection.Encode })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.decodeXmlEntities", () =>
		runModifyTextEncodingCommand({ type: TextEncodingType.XmlEntityEncoding, direction: TextEncodingDirection.Decode })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.base64EncodeText", () =>
		runBase64EncodingCommand({ direction: Base4EncodingDirection.Encode, onEachLine: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.base64EncodeTextOnEachLine", () =>
		runBase64EncodingCommand({ direction: Base4EncodingDirection.Encode, onEachLine: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.base64DecodeText", () =>
		runBase64EncodingCommand({ direction: Base4EncodingDirection.Decode, onEachLine: false })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.base64DecodeTextOnEachLine", () =>
		runBase64EncodingCommand({ direction: Base4EncodingDirection.Decode, onEachLine: true })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.pasteTextSlot1Content", () =>
		runpasteTextSlotCommand(context, { slotId: 1 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.pasteTextSlot2Content", () =>
		runpasteTextSlotCommand(context, { slotId: 2 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.pasteTextSlot3Content", () =>
		runpasteTextSlotCommand(context, { slotId: 3 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.pasteTextSlot4Content", () =>
		runpasteTextSlotCommand(context, { slotId: 4 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.pasteTextSlot5Content", () =>
		runpasteTextSlotCommand(context, { slotId: 5 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.setTextSlot1Content", () =>
		runSetTextSlotContentCommand(context, { slotId: 1 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.setTextSlot2Content", () =>
		runSetTextSlotContentCommand(context, { slotId: 2 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.setTextSlot3Content", () =>
		runSetTextSlotContentCommand(context, { slotId: 3 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.setTextSlot4Content", () =>
		runSetTextSlotContentCommand(context, { slotId: 4 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.setTextSlot5Content", () =>
		runSetTextSlotContentCommand(context, { slotId: 5 })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.caseSensitiveSortAscending", () =>
		runSortCommand({ sortMethod: SortMethod.CaseSensitive, sortDirection: "ascending" })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.caseSensitiveSortDescending", () =>
		runSortCommand({ sortMethod: SortMethod.CaseSensitive, sortDirection: "descending" })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.semverSortAscending", () =>
		runSortCommand({ sortMethod: SortMethod.Semver, sortDirection: "ascending" })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.semverSortDescending", () =>
		runSortCommand({ sortMethod: SortMethod.Semver, sortDirection: "descending" })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.ipAddressSortAscending", () =>
		runSortCommand({ sortMethod: SortMethod.IpAddress, sortDirection: "ascending" })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.ipAddressSortDescending", () =>
		runSortCommand({ sortMethod: SortMethod.IpAddress, sortDirection: "descending" })));
	context.subscriptions.push(vscode.commands.registerCommand("textPowerTools.shuffleLines", () =>
		runSortCommand({ sortMethod: SortMethod.Shuffle, sortDirection: "ascending" })));
}

// this method is called when your extension is deactivated
export function deactivate() {
}
