import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { createGeneratorFromArray, insertSequenceInternal } from "../helpers/sequenceInserter";
import { getExtensionSettings } from "../helpers/tptSettings";

export const enum InsertableSeries {
	LowercaseLetters,
	UppercaseLetters,
	LowercaseGreekLetters,
	UppercaseGreekLetters,
	NatoPhoneticAlphabet,
	LongEnglishMonthNames,
	ShortEnglishMonthNames,
	LongLocaleMonthNames,
	ShortLocaleMonthNames,
	LongEnglishDayNames,
	ShortEnglishDayNames,
	LongLocaleDayNames,
	ShortLocaleDayNames,
}

interface IInsertPredefinedSeriesOptions {
	series: InsertableSeries;
}

export async function runInsertPredefinedSeriesCommand(options: IInsertPredefinedSeriesOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showWarningMessage(NO_ACTIVE_EDITOR);
		return;
	}

	switch (options.series) {
		case InsertableSeries.LowercaseLetters:
			insertLowercaseLetterSequence(editor);
			break;
		case InsertableSeries.LowercaseLetters:
			insertUppercaseLetterSequence(editor);
			break;
		case InsertableSeries.LowercaseGreekLetters:
			insertLowercaseGreekLetterSequence(editor);
			break;
		case InsertableSeries.UppercaseGreekLetters:
			insertUppercaseGreekLetterSequence(editor);
			break;
		case InsertableSeries.NatoPhoneticAlphabet:
			insertNatoPhoneticAlphabetSequence(editor);
			break;
		case InsertableSeries.LongEnglishMonthNames:
			insertLongEnglishMonthNamesSequence(editor);
			break;
		case InsertableSeries.ShortEnglishMonthNames:
			insertShortEnglishMonthNamesSequence(editor);
			break;
		case InsertableSeries.LongLocaleMonthNames:
			insertLongLocaleMonthNamesSequence(editor);
			break;
		case InsertableSeries.ShortLocaleMonthNames:
			insertShortLocaleMonthNamesSequence(editor);
			break;
		case InsertableSeries.LongEnglishDayNames:
			insertLongEnglishDayNamesSequence(editor);
			break;
		case InsertableSeries.ShortEnglishDayNames:
			insertShortEnglishDayNamesSequence(editor);
			break;
		case InsertableSeries.LongLocaleDayNames:
			insertLongLocaleDayNamesSequence(editor);
			break;
		case InsertableSeries.ShortLocaleDayNames:
			insertShortLocaleDayNamesSequence(editor);
			break;
	}
}

function insertLowercaseLetterSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor,
		createGeneratorFromArray([
			"a", "b", "c", "d", "e", "f", "g", "h", "i",
			"j", "k", "l", "m", "n", "o", "p", "q", "r",
			"s", "t", "u", "v", "w", "x", "y", "z",
		])
	);
}

function insertUppercaseLetterSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor,
		createGeneratorFromArray([
			"A", "B", "C", "D", "E", "F", "G", "H", "I",
			"J", "K", "L", "M", "N", "O", "P", "Q", "R",
			"S", "T", "U", "V", "W", "X", "Y", "Z",
		])
	);
}

function insertLowercaseGreekLetterSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor,
		createGeneratorFromArray([
			"α", "β", "γ", "δ", "ε", "ζ", "η", "θ",
			"ι", "κ", "λ", "μ", "ν", "ξ", "ο", "π",
			"ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "q"
		])
	);
}

function insertUppercaseGreekLetterSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor,
		createGeneratorFromArray([
			"Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ",
			"Ι", "Κ", "Λ", "Μ", "Ν", "Ξ", "Ο", "Π",
			"Ρ", "Σ", "Τ", "Υ", "Φ", "Χ", "Ψ", "Ω"
		])
	);
}

function insertNatoPhoneticAlphabetSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor, 
		createGeneratorFromArray([
			"Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel",
			"India", "Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa",
			"Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey",
			"X-ray", "Yankee", "Zulu"
		])
	);
}

const createMonthNamesGenerator = (locale: string | undefined, type: "long" | "short") => {
	const fun = function* () {
		try {
			const formatter = new Intl.DateTimeFormat(locale, { month: type });
			for (let i = 0; i < 12; i++) {
				yield formatter.format(
					new Date(2020, i, 1)
				);
			}
		} catch (err) {
			vscode.window.showErrorMessage(`Unknown locale provided for generator: '${locale}'`);
		}
	};

	return fun;
};

function insertLongEnglishMonthNamesSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor, 
		createMonthNamesGenerator("en-US", "long")
	);
}

function insertShortEnglishMonthNamesSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor, 
		createMonthNamesGenerator("en-US", "short")
	);
}

function insertLongLocaleMonthNamesSequence(editor: vscode.TextEditor) {
	const settings = getExtensionSettings();
	let locale: string | undefined = settings.customLocale;
	if (locale === "") {
		locale = undefined;
	}

	insertSequenceInternal(
		editor, 
		createMonthNamesGenerator(locale, "long")
	);
}

function insertShortLocaleMonthNamesSequence(editor: vscode.TextEditor) {
	const settings = getExtensionSettings();
	let locale: string | undefined = settings.customLocale;
	if (locale === "") {
		locale = undefined;
	}

	insertSequenceInternal(
		editor, 
		createMonthNamesGenerator(locale, "short")
	);
}

const createDayNamesGenerator = (locale: string | undefined, type: "long" | "short") => {
	const fun = function* () {
		try {
			const formatter = new Intl.DateTimeFormat(locale, { weekday: type });
			for (let i = 1; i <= 7; i++) {
				yield formatter.format(
					new Date(2020, 5, i)
				);
			}
		} catch (err) {
			vscode.window.showErrorMessage(`Unknown locale provided for generator: '${locale}'`);
		}
	};

	return fun;
};

function insertLongEnglishDayNamesSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor,
		createDayNamesGenerator("en-US", "long")
	);
}

function insertShortEnglishDayNamesSequence(editor: vscode.TextEditor) {
	insertSequenceInternal(
		editor, 
		createDayNamesGenerator("en-US", "short")
	);
}

function insertLongLocaleDayNamesSequence(editor: vscode.TextEditor) {
	const settings = getExtensionSettings();
	let locale: string | undefined = settings.customLocale;
	if (locale === "") {
		locale = undefined;
	}

	insertSequenceInternal(
		editor,
		createDayNamesGenerator(locale, "long")
	);
}

function insertShortLocaleDayNamesSequence(editor: vscode.TextEditor) {
	const settings = getExtensionSettings();
	let locale: string | undefined = settings.customLocale;
	if (locale === "") {
		locale = undefined;
	}

	insertSequenceInternal(
		editor, 
		createDayNamesGenerator(locale, "short")
	);
}
