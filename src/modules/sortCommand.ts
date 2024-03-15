import { compare, compareCIDR } from "ip6addr";
import semverSort from "semver-sort";
import * as voca from "voca";
import * as vscode from "vscode";
import { NO_ACTIVE_EDITOR } from "../consts";
import { compareNumbers } from "../helpers/utils";
import { expandSelectionToFullLine, getSelectionLines, getSelectionsOrFullDocument, replaceSelectionsWithLines } from "../helpers/vsCodeHelpers";

export const enum SortMethod {
	CaseSensitive,
	CaseSensitiveAtColumn,
	CaseInsensitiveAtColumn,
	Semver,
	IpAddress,
	LengthCaseSensitive,
	LengthCaseInsensitive,
	WordCount,
	GraphemeCount,
	Shuffle,
	Reverse,
	DecimalNumberValue,
	HexadecimalNumberValue,
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
					if (options.sortDirection === "descending") {
						compareResult = compareResult * -1;
					}

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
						if (options.sortDirection === "descending") {
							compareResult = compareResult * -1;
						}

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
							if (options.sortDirection === "descending") {
								compareResult = compareResult * -1;
							}

							return compareResult;
						});
						break;
			case SortMethod.LengthCaseSensitive:
				lines.sort((a, b) => {
					let compareResult = compareNumbers(a.length, b.length);

					if (compareResult === 0) {
						compareResult = a.localeCompare(b, undefined, {
							sensitivity: "variant",
							caseFirst: "upper"
						});
					}

					if (options.sortDirection === "descending") {
						compareResult = compareResult * -1;
					}

					return compareResult;
				});
				break;
			case SortMethod.LengthCaseInsensitive:
				lines.sort((a, b) => {
					let compareResult = compareNumbers(a.length, b.length);

					if (compareResult === 0) {
						compareResult = a.localeCompare(b, undefined, {
							sensitivity: "base"
						});
					}

					if (options.sortDirection === "descending") {
						compareResult = compareResult * -1;
					}

					return compareResult;
				});
				break;
			case SortMethod.WordCount:
				lines.sort((a, b) => {
					let compareResult = compareNumbers(voca.countWords(a), voca.countWords(b));

					if (compareResult === 0) {
						compareResult = a.localeCompare(b, undefined, {
							sensitivity: "base"
						});
					}

					if (options.sortDirection === "descending") {
						compareResult = compareResult * -1;
					}

					return compareResult;
				});
				break;
			case SortMethod.GraphemeCount:
				lines.sort((a, b) => {
					let compareResult = compareNumbers(voca.countGraphemes(a), voca.countGraphemes(b));

					if (compareResult === 0) {
						compareResult = a.localeCompare(b, undefined, {
							sensitivity: "base"
						});
					}

					if (options.sortDirection === "descending") {
						compareResult = compareResult * -1;
					}

					return compareResult;
				});
				break;
			case SortMethod.Semver:
				if (options.sortDirection === "ascending") {
					lines = semverSort.asc(lines);
				} else {
					lines = semverSort.desc(lines);
				}
				break;
			case SortMethod.IpAddress:
				try {
					lines.sort(sortIpAddressesOrCidrRanges);
					if (options.sortDirection === "descending") {
						lines.reverse();
					}
				} catch (err) {
					vscode.window.showErrorMessage(
						vscode.l10n.t("Failed to sort: selection contains invalid IP addresses.")
					);
				}

				break;
			case SortMethod.Shuffle:
				shuffleArray(lines);
				break;
			case SortMethod.Reverse:
				lines = lines.reverse();
				break;
			case SortMethod.DecimalNumberValue:
			case SortMethod.HexadecimalNumberValue:
				var linesWithNumbers: [number, string][] = lines.map(line => {
					let numberValue = Number.NaN;
					if (options.sortMethod === SortMethod.DecimalNumberValue) {
						numberValue = Number(line);
					} else if (/^(0x)?[0-9a-f]+$/i.test(line)) {
						numberValue = parseInt(line, 16);
					}

					return [numberValue, line];
				});

				linesWithNumbers.sort((a, b) => {
					if (Number.isNaN(a[0]) && Number.isNaN(b[0])) {
						return 0;
					}

					if (Number.isNaN(a[0])) {
						return 1;
					}

					if (Number.isNaN(b[0])) {
						return -1;
					}

					let compareResult = compareNumbers(a[0], b[0]);

					if (options.sortDirection === "descending") {
						compareResult = compareResult * -1;
					}

					return compareResult;
				});

				lines = linesWithNumbers.map(x => x[1]);
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

function sortIpAddressesOrCidrRanges(ipOrCidrA: string, ipOrCidrB: string): number {
	if (ipOrCidrA.indexOf("/") !== -1 && ipOrCidrB.indexOf("/") !== -1) {
		return compareCIDR(ipOrCidrA, ipOrCidrB);
	} else if (ipOrCidrA.indexOf("/") !== -1) {
		const aIp = ipOrCidrA.substring(0, ipOrCidrA.indexOf("/"));
		return compare(aIp, ipOrCidrB);
	} else if (ipOrCidrB.indexOf("/") !== -1) {
		const bIp = ipOrCidrB.substring(0, ipOrCidrB.indexOf("/"));
		return compare(ipOrCidrA, bIp);
	}

	return compare(ipOrCidrA, ipOrCidrB);
}
