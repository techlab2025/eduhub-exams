/**
 * Country model representing a nation's geographical and cultural data
 */
export default class PrivacyModel {
  public readonly privacy: Record<string, string>;

  constructor(data: { privacy: Record<string, string> }) {
    this.privacy = data.privacy;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns FaqsModel instance
   */
  static fromJson(json: any): PrivacyModel {
    if (!json) {
      throw new Error("Cannot create FaqsModel from null or undefined");
    }

    return new PrivacyModel({
      privacy: json.privacy,
    });
  }

  static example: PrivacyModel = new PrivacyModel({
    privacy: {
      en: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      ar: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      fr: "lorem ipsum dolor sit amet consectetur adipiscing elit",
    },
  });
}
