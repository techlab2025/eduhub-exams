/**
 * Country model representing a nation's geographical and cultural data
 */
export default class TermsConditionsModel {
  public readonly terms_conditions: Record<string, string>;

  constructor(data: { terms_conditions: Record<string, string> }) {
    this.terms_conditions = data.terms_conditions;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns FaqsModel instance
   */
  static fromJson(json: any): TermsConditionsModel {
    if (!json) {
      throw new Error("Cannot create FaqsModel from null or undefined");
    }

    return new TermsConditionsModel({
      terms_conditions: json.terms_conditions,
    });
  }

  static example: TermsConditionsModel = new TermsConditionsModel({
    terms_conditions: {
      en: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      ar: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      fr: "lorem ipsum dolor sit amet consectetur adipiscing elit",
    },
  });
}
