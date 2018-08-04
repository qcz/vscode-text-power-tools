import * as vscode from "vscode";

export function getFullDocumentRange(editor: vscode.TextEditor): vscode.Selection {
	if (editor.document.lineCount > 0) {
		let lineCount = editor.document.lineCount;
		return new vscode.Selection(0, 0, lineCount, editor.document.lineAt(lineCount-1).text.length);
	}

	return new vscode.Selection(0, 0, 0, 0);
}

export function getSelections(editor: vscode.TextEditor): vscode.Selection[] {
	var selections = editor.selections;

	if (!selections
		|| !selections.length
		|| (selections.length === 1
			&& selections[0].isSingleLine
			&& selections[0].start.character === selections[0].end.character))
	{
		selections = [];
		selections.push(getFullDocumentRange(editor));
	}

	return selections;
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

export async function replaceLinesOfSelections(editor: vscode.TextEditor, selections: vscode.Selection[],
	contentBySelection: string[][], openNewDocument: boolean)
{
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
