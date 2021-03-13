import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { expandSelectionToFullLine, getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";
import semverSort from "semver-sort";
import ip6addr from "ip6addr";

export const enum SortMethod {
	CaseSensitive,
	CaseSensitiveAtColumn,
	CaseInsensitiveAtColumn,
	Semver,
	IpAddress,
	Shuffle
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
	const updatedSelections = [];
	const linesBySelection: string[][] = [];

	for (let selection of selections) {
		const selectionStartColumn = editor.selection.start.character;
		selection = expandSelectionToFullLine(editor, selection);
		updatedSelections.push(selection);

		let lines = Array.from(getSelectionLines(editor, selection));
		
		switch (options.sortMethod) {
			case SortMethod.CaseSensitive:
				lines.sort((a, b) => {
					let compareResult = a.localeCompare(b, undefined, {
						sensitivity: "variant",
						caseFirst: "upper"
					});
					if (options.sortDirection === "descending")
						compareResult = compareResult * -1;

					return compareResult;
				});
				break;
			case SortMethod.CaseSensitiveAtColumn:
					lines.sort((a, b) => {
						const aAtColumn = selectionStartColumn > 0 ? a.substring(selectionStartColumn) : a;
						const bAtColumn = selectionStartColumn > 0 ? b.substring(selectionStartColumn) : b;

						let compareResult;
						if (aAtColumn === "" && bAtColumn === "") {
							compareResult = a.localeCompare(b, undefined, {
								sensitivity: "variant",
								caseFirst: "upper"
							});
						} else {
							compareResult = aAtColumn.localeCompare(bAtColumn, undefined, {
								sensitivity: "variant",
								caseFirst: "upper"
							});
						}
						if (options.sortDirection === "descending")
							compareResult = compareResult * -1;
	
						return compareResult;
					});
					break;
				case SortMethod.CaseInsensitiveAtColumn:
						lines.sort((a, b) => {
							const aAtColumn = selectionStartColumn > 0 ? a.substring(selectionStartColumn) : a;
							const bAtColumn = selectionStartColumn > 0 ? b.substring(selectionStartColumn) : b;
	
							let compareResult;
							if (aAtColumn === "" && bAtColumn === "") {
								compareResult = a.localeCompare(b, undefined, {
									sensitivity: "base"
								});
							} else {
								compareResult = aAtColumn.localeCompare(bAtColumn, undefined, {
									sensitivity: "base"
								});
							}
							if (options.sortDirection === "descending")
								compareResult = compareResult * -1;
		
							return compareResult;
						});
						break;
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
			case SortMethod.Shuffle:
				shuffleArray(lines);
				break;
		}

		linesBySelection.push(lines);
	}

	await replaceSelectionsWithLines(editor, updatedSelections, linesBySelection, /* openNewDocument: */false);
}

/**
 * Shuffles the element of an array.
 * From: https://stackoverflow.com/a/2450976/336119
 * @param array The array to shuffle
 */
function shuffleArray(array: string[]): void {
	let currentIndex: number = array.length, temporaryValue: string, randomIndex: number;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
  
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
}