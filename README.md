# Text Power Tools

Text Power Tools is an extension for text manipulation inspired by _TextFX_ for Notepad++ and _Filter Text_ for Sublime Text. All commands supports multiple selections where it is applicable, and many of them can target new documents, so the original source remains unchanged.

## Features

### Filtering lines

Filter line commands take an input (a raw text or a regular expression) and filter the selected lines based on whether to include or exclude the them. These commands search/match in a case insensitive manner. To use case sensitive search/match, set the value of the `textPowerTools.caseSensitiveFiltering` setting to `true`.

![sample filtering](images/filtering.gif)

| Command | Input | Description | Selection support |
| ------- | ----- | ----------- | ------------------|
| **Filter lines including string** | Raw text | Replaces the content of all selections (or the full document if nothing is selected) with only the lines which include the input string. | Supports multiple selections. Works on the full document if nothing selected.
| **Filter lines including string into a new editor** | Raw text | Creates a new document with the lines which include the input string. | Supports multiple selections. Works on the full document if nothing selected.
| **Filter lines matching a regex** | Regular expression | Replaces the content of all selections (or the full document if nothing is selected) with only the lines which match the regular expression. | Supports multiple selections. Works on the full document if nothing selected.
| **Filter lines matching a regex into a new editor** | Regular expression | Creates a new document with the lines which match the regular expression. | Supports multiple selections. Works on the full document if nothing selected.
| **Filter lines not including string** | Raw text | Replaces the content of all selections (or the full document if nothing is selected) with only the lines which do not include the input string. | Supports multiple selections. Works on the full document if nothing selected.
| **Filter lines not including string into a new editor** | Raw text | Creates a new document with the lines which do not include the input string. | Supports multiple selections. Works on the full document if nothing selected.
| **Filter lines not matching a regex** | Regular expression | Replaces the content of all selections (or the full document if nothing is selected) with only the lines which do not match the regular expression. | Supports multiple selections. Works on the full document if nothing selected.
| **Filter lines not matching a regex into a new editor** | Regular expression| Creates a new document with the lines which do not match the regular expression. | Supports multiple selections. Works on the full document if nothing selected.

### Removing lines

| Command | Input | Description | Selection support |
| ------- | ----- | ----------- | ------------------|
| **Remove duplicated lines** | _none_ | Removes all duplicates of lines, so only the first occurrence remains in the document or selections. | Supports multiple selections. Works on the full document if nothing selected.
| **Remove blank lines** | _none_ | Removes all blank lines from the document or selections. | Supports multiple selections. Works on the full document if nothing selected.
| **Remove surplus blank lines** | _none_ | Removes surplus blank lines if there are two or more are in the document or selections consecutively. | Supports multiple selections. Works on the full document if nothing selected.

## Requirements

This extension requires at least Visual Studio Code 1.20.
