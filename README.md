# Text Power Tools

Text Power Tools is an all-in-one text manipulation extension for VS Code inspired by _TextFX_ for Notepad++ and _Filter Lines_ for Sublime Text. All commands supports multiple selections where it is applicable, and many of them can target new documents, so the original source remains unchanged.

All features are available from either the *Command Palette* or the editor context menu. To access the commands from the Command Palette use `Ctrl+Shift+P`, and enter `tpt` or part of your favourite Text Power Tool command name (e.g. `filter`, `guid` etc.) to quickly access the list of available commands. Almost all commands are available from the editor context menu, which is accessible from the *Text Power Tools* submenu after right clicking in the editor area.

**Note:** Due to current architectural limitations of VSCode, no extension can access files larger than 50 Megabytes. Vote for [VSCode issue #31078](https://github.com/Microsoft/vscode/issues/31078), which once implemented, will allows this extension to work with these large files. In the meantime you can trick VSCode by opening a new file and copying the content of the large file there (without saving).

## Features
* **Filter lines using strings or regular expressions (grep like experience), even into new editors (without modifying the original source):** Filter line commands take an input (a raw text or a regular expression) and filter the selected lines based on whether the user wants to include or exclude lines containing that string or matching that regex. It works just like like `grep` but inside VS Code.

  All filtering commands can target new editors, so the original content won't be changed. Search commands with `into a new editor` end to use this feature.

  These commands search/match in a case insensitive manner. To use case sensitive search/match, set the value of the `textPowerTools.caseSensitiveFiltering` setting to `true`.

  The last 10 filter strings and regular expressions are presented and can be used quickly when executing these commands.

* **Extract information from the source lines using regular expressions:** First input is the regular expression which should be matched with capture groups to find the desired parts of the lines (e.g.: `(\d.\d) dogs`). The second input is the replacement rule, which should contain capture group references (e.g. `$1 cats`). With these commands you can transform matching lines to the desired format in seconds.

  The last 10 filter strings and replacement expressions are presented and can be used quickly when executing these commands.
* **Remove duplicated, empty, surplus empty lines and control characters**
* **Count occurrences of lines:** This command will counts how many times a line appears in the selected text and generates an output with the number of occurrences and the lines themselves
* **Insert decimal, hex and Roman numeral sequences:** Inserts sequence of decimal, hex or Roman numbers to every selection. If there is only one selection, it will prompt for how many elements to insert. When inserting hex numbers, by default they will be uppercase. To insert lowercase hex numbers, set the value of the `textPowerTools.insertUppercaseHexNumbers` setting to `false`.
* **Insert items from predefined sequences**: Inserts sequence of items from a predefined set to every selection. If there is only one selection, it will prompt for how many elements to insert. Currently the following predefined sequences are supported:
    * _Uppercase letters_
    * _Lowercase letters_
    * _Uppercase Greek letters_
    * _Lowercase Greek letters_
    * _Long english month names_
    * _Short english month names_
    * _Long english day names_
    * _Short english day names_
    * _Long current/custom locale month names_
    * _Short current/custom locale month names_
    * _Long current/custom locale day names_
    * _Short current/custom locale day names_
    
    (Note: current/custom locale means OS locale or the locale specified in the `textPowerTools.customLocale` setting)
* **Insert line numbers:** Inserts line numbers to the start of each line in every selection. Line numbers can be real line numbers in the file or can start with 1.
* **Insert full file path, directory path and file name of the opened file**.
* **Insert Unix timestamp**
* **Generate GUIDs**: Inserts GUIDs (globally unique identifiers or universally unique identifier) to the text in the selected format. Mutiple GUIDs can be inserted at once. To insert GUIDs with uppercase hex characters, set the value of the `textPowerTools.insertUppercaseGuids` setting to `true`. The default GUID style can be set using the `textPowerTools.defaultGuidType` setting.
* **Change case of text (camelCase, PascalCase, snake_case, CONSTANT_CASE, dash-case, dot.case) and swap casing**.

  Note: *Title Case*, *UPPER CASE* and *lower case* is not implemented in this extension as it is available in VS Code by default via the *Transform to Title Case*, Transform to Uppercase* and *Transform to Lower Case* commands respecively.
* **Pad start and end of strings:** Pad the start or the end of selections to the desired length with default or custom character sequences. The default pad string can be customized with the `textPowerTools.defaultPadString` setting.
* **Copy content of selections to a new editor**
* **Convert numbers from decimal to hexadecimal and vice versa**
* **Format content as table** by splitting text to pieces by predefined or custom characters or strings and formatting them as a table with equal length columns using space characters.

  Text can be splitted by tabulators, semicolons, commas, pipes or any custom character sequences.
* **Text slots**, which are like permanent clipboard entries in your VS Code. Recommended to bind the most frequently used slot commands to a key combo.
* **Encode and decode various encoding formats**: URL encode, HTML entities, XML entities and Base64
* **Generate Lorem impsum texts**
* **Convert to Zalgo text**

## Showcase

### Filtering in action
![sample filtering](images/filtering.gif)

Description:
* Opening the VS Code Command Palette with `Ctrl+Shift+P`
* Entering `filter`, so Text Power Tools' filter commands are dispalyed
* Selecting the `Text Power Tools: Filter lines including string into a new editor` command
* Entering `tiger` as the filter text
* The command runs and pipes the result into a new editor

### Extracting information in action
![sample extracting](images/extracting.gif)

### Counting the number of occurrences
![sample formatting as table](images/counting.gif)

### Formatting text as table
![sample formatting as table](images/formatAsTable.gif)

## Requirements

Before 1.16.0, the extension required at least Visual Studio Code 1.26.
After 1.16.0, the extension requires at least Visual Studio Code 1.50.

## License

MIT

Sample images use text files from the [Elasticsearch Examples](https://github.com/elastic/examples) and [TensorFlow Models](https://github.com/tensorflow/models) projects. Both are under the Apache 2.0 License.