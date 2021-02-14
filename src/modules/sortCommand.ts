import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";
import semverSort from "semver-sort";
import ip6addr from "ip6addr";

export const enum SortMethod {
	Semver,
	IpAddress
}

interface ISortOptions {
	sortMethod: SortMethod;
	sortDirection: "ascending" | "descending";
}

export async function runSortCommand(options: ISortOptions) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage(NO_ACTIVE_EDITOR);
		return;
	}

	const selections = getSelectionsOrFullDocument(editor);
	const linesBySelection: string[][] = [];

	for (const selection of selections) {
		let lines = Array.from(getSelectionLines(editor, selection));
		
		switch (options.sortMethod) {
			case SortMethod.Semver:
				if (options.sortDirection === "ascending")
					lines = semverSort.asc(lines);
				else
					lines = semverSort.desc(lines);
				break;
			case SortMethod.IpAddress:
				try {
					lines.sort(ip6addr.compare);
					if (options.sortDirection === "descending")
						lines.reverse();
				}
				catch (err) {
					vscode.window.showErrorMessage("Failed to sort: selection contains invalid IP addresses.");
				}

				break;
		}

		linesBySelection.push(lines);
	}

	await replaceSelectionsWithLines(editor, selections, linesBySelection, /* openNewDocument: */false);
}
