import de from "../../locales/locale.de.json";
import en from "../../locales/locale.en.json";

/**
 * The `LocalizerParser` class is designed to handle the parsing of nested localization files
 * into flat key-value pairs for easier access to localized strings.
 */
export class LocalizerParser {

  private files: [string, object][] = [
    ["de", de],
    ["en", en],
  ];

  /**
   * Retrieves a parsed representation of the internal file data.
   * Iterates through the `files` collection, processing each entry
   * by converting its contents into a key-value mapping structure.
   *
   * @return {Record<string, Record<string, string>>} An object where each key corresponds to a file entry,
   * and the value is another object representing the parsed key-value structure of that file's contents.
   */
  public getParsedFiles(): Record<string, Record<string, string>> {
    const parsedData: Record<string, Record<string, string>> = {};

    for (const entry of this.files) {

      const parsed = this.parseObjectToKeyValues(entry[1]);
      parsedData[entry[0]] = parsed;
    }

    return parsedData;
  }

  private parseObjectToKeyValues(element: object): Record<string, string> {
    const entries: Record<string, string> = {};

    for (const [key, value] of Object.entries(element)) {
      if (typeof value === "string") {
        entries[key] = value;
        continue;
      }

      // Calling the parseObjectToKeyValues method recursively
      const newEntries = this.parseObjectToKeyValues(value);
      for (const entry in newEntries) {
        const newKey = `${key}.${entry}`;
        entries[newKey] = newEntries[entry];
      }
    }

    return entries;
  }

}

