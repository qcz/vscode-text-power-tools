import * as vscode from "vscode";

export function compareNumbers(a: number , b: number) {
	return a < b ? -1 : a > b ? 1 : 0;
}

export function getHumanizedLanguageName(locale: string): string {
	switch (locale) {
		case "cz":
			return vscode.l10n.t("Czech");
		case "de":
			return vscode.l10n.t("German");
		case "el":
			return vscode.l10n.t("Greek");
		case "en":
			return vscode.l10n.t("English");
		case "es":
			return vscode.l10n.t("Spanish");
		case "fi":
			return vscode.l10n.t("Finnish");
		case "fr":
			return vscode.l10n.t("French");
		case "hr":
			return vscode.l10n.t("Croatian");
		case "hu":
			return vscode.l10n.t("Hungarian");
		case "id_ID":
			return vscode.l10n.t("Indonesian");
		case "it":
			return vscode.l10n.t("Italian");
		case "ja":
			return vscode.l10n.t("Japanese");
		case "ko":
			return vscode.l10n.t("Korean");
		case "lv":
			return vscode.l10n.t("Latvian");
		case "nb_NO":
			return vscode.l10n.t("Norwegian");
		case "nl":
			return vscode.l10n.t("Dutch");
		case "pl":
			return vscode.l10n.t("Polish");
		case "pt_BR":
			return vscode.l10n.t("Portugese (Brazil)");
		case "pt_PT":
			return vscode.l10n.t("Portugese (Portugal)");
		case "ro":
			return vscode.l10n.t("Romanian");
		case "ru":
			return vscode.l10n.t("Russian");
		case "sk":
			return vscode.l10n.t("Slovakian");
		case "sv":
			return vscode.l10n.t("Swedish");
		case "tr":
			return vscode.l10n.t("Turkish");
		case "uk":
			return vscode.l10n.t("Ukranian");
		case "vi":
			return vscode.l10n.t("Vietnamese");
		default:
			return locale;
	}
}
