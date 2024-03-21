# Changelog

## **1.47.0** (2023. 03. 21.)
* Complete Japanese localization by @wany-oh. (#83)
* Brazilian Portuguese localization by @thiagojramos (#86)

## **1.46.0** (2023. 03. 17.)
* Add _Generate random WGS84 coordinates_ functions, including generator functions for specific continents. (#79)
* Add _Encode HTML entities (all named references)_ command.
* Introduce localization support in collaboration with @wany-oh. (#82)
* Partial Japanese localization by @wany-oh. (#82)

## **1.45.0** (2023. 11. 30.)
* Add functions for sorting lines by decimal and hexadecimal numeric value (#78)

## **1.44.0** (2023. 10. 07.)
* Add _Keep a number of random lines_ and _Keep a percentage of random lines_ commands.
* Add _Change case to sentence case_ command (#74).
* Add _Insert date_, _time_ and _timestamp_ commands using editor locale & custom locale.
* Add _Insert UTC timestamp (ISO 8601)_ command.
* Fix: Handle unicode letters properly in change case commands.

## **1.43.1** (2023. 09. 19.)
* Fix bug in Keep only uniques command.

## **1.43.0** (2023. 09. 16.)
* Pad counters in the output of _Count line occurrences_ and _Count adjacent duplicates_ commands, so the result can be sorted using standard sorting commands.
* Add _Keep only unique lines_ and _Keep only unique lines (case insensitive)_ commands (#72)

## **1.42.0** (2023. 09. 09.)
* Add _Remove duplicated lines (case insensitive)_ command
* Add _Keep only duplicated lines_ and _Keep only duplicated lines (case insensitive)_ commands (#72)
* Add commands related to adjacent duplicated lines (#72):
   * _Remove adjacent duplicated lines_
   * _Remove adjacent duplicated lines (case insensitive)_
   * _Keep only adjacent duplicated lines_
   * _Keep only adjacent duplicated lines (case insensitive)_
   * _Count adjacent duplicated lines_


## **1.41.0** (2023. 06. 16.)
* Add _Join every two lines_ and _Join every N lines_ family of commands. (#67)
* Add _Split lines_ family of commands.
* Add _Replace whitespace with a single space_ command. (#69)
* Add missing _Sort lines by grapheme count ascending_ command to the context menu. (#68)

## **1.40.2** (2023. 03. 15.)
* Do not show TPT context menu in output window (#65).
* Bump required VSCode version to 1.75.0.

## **1.40.1** (2023. 02. 18.)
- Fix bug in _Escape text for JSON_ introduced in 1.40.0. (#63)

## **1.40.0** (2023. 02. 18.)
- Add _Generate random items from user input_ command (with history support, #62).
- Add _Generate random decimal/hexadecimal/real numbers from range_ command (#61).
- Add _Unescape JSON escaped text_ command. (#60)

## **1.39.0** (2023. 02. 10.)
- Add _Spread paste lines from clipboard_ commands (with 4 variations, #56)

## **1.38.0** (2022. 11. 04.)
- Add _Separate words with spaces_, _Separate words with forward slashes_ and _Separate words with backslashes_ commands. (#52)

## **1.37.0** (2022. 10. 25.)
- Introduce advanced title casing for English texts. (49)
- Add _Change case to sponge case_ command.

## **1.36.1** (2022. 08. 28.)
- Fix Unicode casing in the name of two commands.

## **1.36.0** (2022. 08. 28.)
- Add _Convert to unicode escape sequences_ and _Decode unicode escape sequences_ commands. (#46)
- Add support for generating random IPv4 and IPv6 addresses.
- Add _Convert to Unicode normalization form_ commands (NFC, NFD, NFKC, NFKD).

## **1.35.0** (2022. 08. 13.)
- Enable running in untrusted workspaces.

## **1.34.0** (2022. 06. 25.)
- Add support for running as a Web Extension.
- Add _Duplicate selection content_ and _Repeat selection content_ commands. (#42)
- Add support for sorting CIDR ranges in the IP address sort function. (#41)

## **1.33.0** (2022. 04. 06.)
- New editors opened via the "_into a new editor_" commands now has the same language mode as their ancestors.

## **1.32.0** (2022. 04. 06.)
- Add _Replace new lines and whitespace with a single space_ command.

## **1.31.2** (2022. 03. 24.)
- Restore support of filtering the full file without selection (#39)

## **1.31.1** (2022. 03. 17.)
- Fix replacement of multiple newlines in new functionality introduced in 1.31.0 (#38)

## **1.31.0** (2022. 03. 15.)
- Support newlines in the output of the _Extract information from text_ commands. (#37)
- Support encoding newlines for URL encode, HTML entities, XML entities. Base commands are now always works with the full selection, and there are new commands to encode on each line like for Base64 econdig. (#31)
- Add support for filter lines including/not including the selected text. (#27)
- Display warning for filter commands when there are no selection or when a single line is selected. (#26)
- Fix `Illegal value for line` bug error message when there was no selection. (#35)
- Fix typo in settings. (Thanks @chschroeIBM, #32)

## **1.30.0** (2021. 09. 12.)
- Add _Reverse lines_ command.
- Fix text truncation bug in the _Escape text for JSON_ command.

## **1.29.0** (2021. 09. 04.)
- Add _Trim leading whitespace_ and _Trim leading & trailing whitespace_ commands.
- Add _Remove whitespace characters_ command.
- Add _Remove newlines_ and _Trim whitespace and remove newlines_ commands.
- Changed keybinding for _Filter lines including a string_ to `Ctrl+K G` due to a collision with a default keybinding.
- Removed the keybinding for the _Generate random GUIDs_ command due to a collision with a default keybinding.

## **1.28.0** (2021. 07. 17.)
- Add _Change case to title case_ command.
- Add copy and cut lines _including a string_, _not including a string_, _matching a regex_, and _not matching a regexp_ to clipboard as an extension to the current filter functions.

## **1.27.0** (2021. 04. 24.)
- Add _Latinize text_ and _Slugify text_ functions.
- Add _Sort lines by word count_ and _Sort lines by grapheme count_ functions.

## **1.26.0** (2021. 04. 12.)
- Add _Escape text for JSON_ and _Convert text to JSON string_ commands.

## **1.25.1** (2021. 04. 11.)
- Fix history logo pollution in commands using the quick pick which supports history (for example the _Filter lines_ commands).

## **1.25.0** (2021. 04. 02.)
- _Remove blank lines_ and _Remove surplus blank lines_ commands renamed to _Remove empty lines_ and _Remove surplus empty lines_.
- Added _Remove blank lines_ and _Remove surplus blank lines_ commands to remove lines contaning no text or only whitespace characters.

## **1.24.0** (2021. 03. 27.)
- Add commands to _prefix_, _suffix_ and _wrap_ (with same or different prefix and suffix) lines.

## **1.23.0** (2021. 03. 21.)
- Add commands to increase/decrease decimal and hexadecimal numbers. Increasing hexadecimal numbers can also be made using 8, 16, 32 and 64 bit arithmetic.

## **1.22.1** (2021. 03. 16.)
- Fix insert number sequence when starting number is 0.

## **1.22.0** (2021. 03. 13.)  [_Sort All The Things Edition_]
- Add commands to convert between decimal and hexadecimal numbers using 8, 16, 32 and 64 bit arithmetic.
- Ignore empty and whitespace only lines when converting between decimal and hexadecimal numbers.
- Add _Sort lines ascending/descending (case sensitive)_ commands
- Add _Sort lines ascending/descending (case sensitive/insensitive at column of selection start)_ commands
- Add _Sort lines by length (and then case sensitive/insensitive)_ commands
- Add _Shuffle lines_ command

## **1.21.0** (2021. 02. 14.)
- Add _Sort lines ascending/descending using semver rules_ and _Sort IP addresses ascending/descending_ commands.

## **1.20.0** (2021. 02. 06.)
- Add icons to `Insert series of items...`, `Generate fake/random data...` selectors
- Fix name of lowercase/uppercase Greek letters and NATO phonetic alphabet items in `Insert series of items...` selector

## **1.19.1** (2021. 01. 30.)
- Fix missing import in custom version of faker dependency
- Remove missing (removed) command from submenu definition

## **1.19.0** (2021. 01. 30.) [_Insert All The Things Edition_]
- Move to use title/prompt instead of placeholders when showing input boxes to the user so instructions are always visible.
- Modify insert number sequence commands to ask for number of items to insert when there is only one selection.
- Add support for inserting Roman numeral sequences.
- Add support for inserting predefined sequences (uppercase letters, lowercase letters, uppercase Greek letters, lowercase Greek letters, NATO phonetic alphabet, English or current/custom locale month names, English or current/custom locale day names).
- Add support for generating fake data (first name, last name and full name in English, French, German and Hungarian; random hex and decimal character sequences).
- Removed standalone command for generating multiple GUIDs, five lorem ipsum sentences and five lorem ipsum paragraphs. Random GUID/UUID and lorem ipsum sentence/paragraph generation logics were folded into the new sequence generation system, which asks how many items you want to generate if there is only one selection in the active text editor.
- Add support for inserting Unix timestamps.

## **1.18.0** (2020. 11. 24.)
- Add support for text slots, which are like permanent clipboard entries in your VS Code.

## **1.17.0** (2020. 10. 17.)
- Add _Convert to zalgo text_ commands with 4 levels of intensity.
- Add _Insert full file path_, _Insert directory path_ and _Insert file name_ of the opened file commands.

## **1.16.0** (2020. 10. 03.)
- Add *Text Power Tools* editor submenu with all available commands.
- Modify pad commands to work on each line instead the content of the selection merged to a single line.

## **1.15.0** (2020. 08. 22.)
- Add support for encoding and decoding various text encodings:
  - URL encoding
  - XML entities
  - HTML entities
  - Base64 (full selection or by each line in selection)

## **1.14.0** (2020. 07. 25.)
- Add keybinding for _Filter lines using string_ and _Generate GUID_ commands as an experiment
- Reduce package size by 60% by bundling the source with webpack and optimizing GIFs used in Readme

## **1.13.0** (2020. 07. 12.)
- Most important commands (filter lines, extract information and copy selection to new editor) are now available in the editor context menu.

## **1.12.0** (2020. 06. 30.)
- Add _Generate Lorem ipsum_ command
- Add `defaultGuidType` setting to specify the type of GUID generated by the 'Generate a GUID' or 'Generate multiple GUIDs' functions.

## **1.11.1** (2019. 04. 06.)
- Small changes to README.

## **1.11.0** (2019. 04. 06.)
- Add _Convert selected hexadecimal numbers to decimal_ and Convert selected decimal numbers to hexadecimal_ commands.

## **1.10.0** (2019. 01. 04.)
- Add _Copy content of selections to a new editor_ command

## **1.9.1** (2019. 01. 03.)
- Fix _Generate Guid_ command descriptions

## **1.9.0** (2018. 12. 28.)
- Added change case commands (camelCase, PascalCase, snake_case, CONSTANT_CASE, dash-case, dot.case, swap case)

## **1.8.0** (2018. 12. 22.)
- Added _Remove control characters_ command
- Added additional output formats for the _Generate GUID_ command (eg. without dashes, with braces)

## **1.7.1** (2018. 12. 15.)
- Fix missing node module error

## **1.7.0** (2018. 12. 15.)
- Added _Generate GUID_ commands

## **1.6.0** (2018. 12. 14.)
- Added _Format content as table_ commands
- Improve naming of _Insert decimal number_/_Insert hex number_ commands

## **1.5.0** (2018. 12. 09.)
- Added _Insert line number_ commands

## **1.4.0** (2018. 11. 24.)
- Added _Pad start_/_Pad end_ commands

## **1.3.0** (2018. 11. 11.)
- Added _Insert decimal number_/_Insert hex number_ commands

## **1.2.1** (2018. 09. 18.)
- Fix minimum supported version of VS Code in README.
- Fix Sublime plugin reference in README.

## **1.2.0** (2018. 09. 13.)
- Add history support for Filter text and Extract information commands.
- Clarify message displayed when there are no active editors to point out that the opened file may
  be too large.

## **1.1.0** (2018. 08. 07.)
- Added _Extract information_ commands.
- Added _Count occurrences_ commands.

## **1.0.0** (2018. 08. 05.)
- Initial release.
