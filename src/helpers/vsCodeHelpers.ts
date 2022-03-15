import * as vscode from "vscode";

export function getFullDocumentRange(editor: vscode.TextEditor): vscode.Selection {
	if (editor.document.lineCount > 0) {
		let lineCount = editor.document.lineCount;
		return new vscode.Selection(0, 0, lineCount - 1, editor.document.lineAt(lineCount - 1).text.length);
	}

	return new vscode.Selection(0, 0, 0, 0);
}

export function getPureSelections(editor: vscode.TextEditor): vscode.Selection[] {
	return editor.selections || [];
}

export function getSelectionsOrFullDocument(editor: vscode.TextEditor): vscode.Selection[] {
	var selections = editor.selections;

	if (!selections
		|| !selections.length
		|| (selections.length === 1
			&& selections[0].isSingleLine
			&& selections[0].start.character === selections[0].end.character)
	) {
		selections = [];
		selections.push(getFullDocumentRange(editor));
	}

	return selections;
}

export function expandSelectionToFullLine(editor: vscode.TextEditor, selection: vscode.Selection): vscode.Selection {
	return new vscode.Selection(
		selection.start.line,
		0,
		selection.end.line,
		editor.document.lineAt(selection.end.line).text.length
	);
}

export function * getSelectionLines(editor: vscode.TextEditor, selection: vscode.Selection) {
	for (let i = selection.start.line; i <= selection.end.line && i < editor.document.lineCount; i++) {
		const currentLine = editor.document.lineAt(i);
		if (i === selection.start.line && i === selection.end.line) {
			yield currentLine.text.substring(selection.start.character,
				selection.end.character);
		} else if (i === selection.start.line) {
			yield currentLine.text.substring(selection.start.character);
		} else if (i === selection.end.line) {
			yield currentLine.text.substring(0, selection.end.character);
		} else {
			yield currentLine.text;
		}
	}
}

export function getSelectionContent(editor: vscode.TextEditor, selection: vscode.Selection) {
	let fullContent = "";
	for (const line of getSelectionLines(editor, selection)) {
		if (fullContent.length !== 0) {
			fullContent += "\n";
		}

		fullContent += line;
	}
	return fullContent;
}

export function getSelectionContentWithoutNewlines(editor: vscode.TextEditor, selection: vscode.Selection) {
	let fullContent = "";
	for (const line of getSelectionLines(editor, selection)) {
		fullContent += line;
	}
	return fullContent;
}

export function sortSelectionsByPosition(selections: vscode.Selection[]) {
	selections.sort((a, b) => {
		if (a.start.line < b.start.line) {
			return -1;
		} else if (b.start.line < a.start.line) {
			return 1;
		} else if (a.start.character < b.start.character) {
			return -1;
		} else if (b.start.character < a.start.character) {
			return 1;
		} else {
			return 0;
		}
	});
}

export async function replaceSelectionsWithText(editor: vscode.TextEditor, selections: vscode.Selection[],
	contentBySelection: string[]
): Promise<void> {
	editor.edit((editBuilder) => {
		for (let i = 0; i < selections.length; i++) {
			editBuilder.replace(selections[i], contentBySelection[i]);
		}
	});
}

export async function replaceSelectionsWithLines(editor: vscode.TextEditor, selections: vscode.Selection[],
	contentBySelection: string[][], openNewDocument: boolean
): Promise<void> {
	if (openNewDocument === true) {
		const targetEditor = await createNewEditor();

		var docRange = getFullDocumentRange(targetEditor);
		if (docRange) {
			targetEditor.edit((editBuilder) => {
				const allMatchingLines: string[] = [];
				for (const matchingLineArr of contentBySelection) {
					allMatchingLines.push(...matchingLineArr);
				}

				editBuilder.replace(docRange, allMatchingLines.join(editor.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n"));
			});
		}
	} else {
		editor.edit((editBuilder) => {
			for (let i = 0; i < selections.length; i++) {
				editBuilder.replace(selections[i], contentBySelection[i].join(editor.document.eol === vscode.EndOfLine.CRLF ? "\r\n" : "\n"));
			}
		});
	}
}

export function createNewEditor(): PromiseLike<vscode.TextEditor> {
	return new Promise((resolve, reject) => {
		vscode.workspace.openTextDocument({content: "", language: "" } as any).then(
			(doc) => {
				resolve(vscode.window.showTextDocument(doc));
			},
			(err) => reject(err)
		);
	});
}

interface HistoryQuickPickOptions {
	context: vscode.ExtensionContext;
	title: string;
	historyStateKey: string;
	onDidAccept: (value: string) => void | Promise<void>;
}

export function showHistoryQuickPick(
	options: HistoryQuickPickOptions
) {
	const fullHistoryStateKey = `history.${options.historyStateKey}`;
	let historyItems = options.context.globalState.get<string[]>(fullHistoryStateKey, []);

	const qp = vscode.window.createQuickPick();
	qp.title = options.title;
	qp.items = historyItems.map(x => {
		return {
			label: `$(history) ${x}`,
		};
	});
	qp.onDidChangeValue(() => {
		if (qp.activeItems.length > 0) {
			if (qp.activeItems[0].label !== qp.value) {
				qp.activeItems = [];
			}
		}
	});
	qp.onDidAccept(() => {
		let selectedValue: string;

		if (qp.activeItems.length) {
			selectedValue = qp.activeItems[0].label;
			const history = selectedValue.match(/^(?:\$\(history\) )+(.*)$/);

			if (history) {
				selectedValue = history[1];
			}
		} else {
			selectedValue = qp.value;
		}

		if (!selectedValue) {
			return;
		}

		if (historyItems.indexOf(selectedValue) !== -1) {
			historyItems.splice(historyItems.indexOf(selectedValue), 1);
		}

		historyItems.splice(0, 0, selectedValue);

		if (historyItems.length > 10) {
			historyItems = historyItems.slice(0, 10);
		}

		options.context.globalState.update(fullHistoryStateKey, historyItems);

		qp.hide();
		qp.dispose();

		options.onDidAccept(selectedValue);
	});
	qp.activeItems = [];
	qp.show();
}
