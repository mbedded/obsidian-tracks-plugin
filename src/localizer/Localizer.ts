/**
 * A utility class for managing localization and translations based on different languages and locales.
 * Allows setting the locale, adding translation texts, and retrieving translated messages with interpolation.
 *
 * Remark: We used "localizify" before, but there were issues with building the plugin
 * using JSON files. So we activated "resolveJsonModule" and created our own simple localizer.
 */
export class Localizer {
  // Use EN as the default language
  private locale: string = "en";
  private texts: Record<string, Record<string, string>> = {};

  public constructor() {
  }

  /**
   * Initializes the localizer with the provided texts.
   *
   * @param {Record<string, Record<string, string>>} texts - A nested record containing localization data, organized by keys and subkeys.
   * @return {void} Throws an error if the texts parameter is null or undefined.
   */
  public initialize(texts: Record<string, Record<string, string>>): void {
    if (texts == null) {
      throw Error("Localizer cannot be initialized using empty texts");
    }

    this.texts = texts;
  }

  /**
   * Sets the locale for the application.
   *
   * @param {string} locale - The locale to be set, defined as a language code (e.g., "en", "fr", "es").
   */
  public setLocale(locale: string) {
    this.locale = locale;
  }

  /**
   * Checks if the specified locale exists in the collection of texts.
   *
   * @param locale The locale to check for existence.
   * @return A boolean indicating whether the specified locale exists (true) or not (false).
   */
  public isLocale(locale: string) {
    return Object.hasOwn(this.texts, locale);
  }

  /**
   * Adds a set of localized text entries for a specified locale.
   *
   * @param {string} locale - The locale identifier (e.g., 'en', 'fr', 'es') to associate with the provided text entries.
   * @param {Record<string, string>} values - A key-value mapping of text entries where keys represent message identifiers, and values represent the localized text for the specified locale.
   */
  public add(locale: string, values: Record<string, string>) {
    this.texts[locale] = values;
  }

  /**
   * Translates a given key into the corresponding text for the current locale.
   * If the key does not exist or the locale is invalid, it returns the key itself.
   * Optionally interpolates dynamic data into the translated text.
   *
   * @param {string} key - The key used to retrieve the translated text.
   * @param {Record<string, string>} [data={}] - An optional object containing dynamic data
   *     to be interpolated into the translated text.
   * @return {string} The translated text with any dynamic data interpolated, or the key if
   *     the translation or locale is unavailable.
   */
  public translate(key: string, data: Record<string, string> = {}): string {
    if (!key) {
      throw new Error("Parameter 'key' is required");
    }

    if (this.isLocale(this.locale) == false) {
      return key;
    }

    const text = this.texts[this.locale][key] ?? key;
    return this.interpolate(text, data);
  }

  private interpolate(text: string, data: Record<string, string>): string {
    return text.replace(/{(\w+)}/g, (match, key) => {
      return Object.hasOwn(data, key) ? data[key] : match;
    });
  }

  /**
   * Resets the localizer to its initial state, clearing all translations and setting the locale to 'en'.
   * Created because of the singleton and testing purposes.
   */
  public reset() {
    this.locale = "en";
    this.texts = {};
  }
}

const localizer = new Localizer();
const t = localizer.translate.bind(localizer);

export { t, localizer as Instance };
export default localizer;
