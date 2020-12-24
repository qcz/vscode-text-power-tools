import * as vscode from "vscode";

export interface ITextPowerToolsSettings {
	caseSensitiveFiltering: boolean;
	defaultPadString: string | undefined;
	insertUppercaseHexNumbers: boolean;
	insertUppercaseGuids: boolean;
	defaultGuidType: string;
	loremIpsumMinWordsPerSentence: number;
	loremIpsumMaxWordsPerSentence: number;
	loremIpsumMinSentencesPerParagraph: number;
	loremIpsumMaxSentencesPerParagraph: number;
	customLocale: string;
}

export function getExtensionSettings(): ITextPowerToolsSettings {
	const vscConfig = vscode.workspace.getConfiguration("textPowerTools");
	
	return {
		caseSensitiveFiltering: vscConfig.get<boolean>("caseSensitiveFiltering", false),
		defaultPadString: vscConfig.get<string>("defaultPadString"),
		insertUppercaseHexNumbers: vscConfig.get<boolean>("insertUppercaseHexNumbers", true),
		insertUppercaseGuids: vscConfig.get<boolean>("insertUppercaseGuids", false),
		defaultGuidType: vscConfig.get<string>("defaultGuidType", "alwaysAsk"),
		loremIpsumMinWordsPerSentence: vscConfig.get<number>("loremIpsum.wordsPerSentence.min", 4),
		loremIpsumMaxWordsPerSentence: vscConfig.get<number>("loremIpsum.wordsPerSentence.max", 16),
		loremIpsumMinSentencesPerParagraph: vscConfig.get<number>("loremIpsum.sentencesPerParagraph.min", 4),
		loremIpsumMaxSentencesPerParagraph: vscConfig.get<number>("loremIpsum.sentencesPerParagraph.max", 8),
		customLocale: vscConfig.get<string>("customLocale", ""),
	};
}
