/**
 * A utility class containing helper methods for general-purpose usage.
 */
export class Helpers {

  private constructor() {
    // Prevent instantiation
  }

  /**
   * Creates a shallow copy of the provided instance.
   *
   * @param {T} instance - The object to be cloned.
   * @return {T} A new object that is a shallow copy of the provided instance.
   */
  public static clone<T>(instance: T): T {
    return {...instance};
  }

  /**
   * Checks if the given title is null, undefined or consists only of whitespace characters.
   *
   * @param {string} title - The string to be checked for emptiness.
   * @return {boolean} True if the title is null, undefined, or empty; false otherwise.
   */
  public static isTitleEmpty(title: string): boolean {
    return title == null || title.trim().length == 0;
  }
}
