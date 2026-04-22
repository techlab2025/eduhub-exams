/**
 * Country model representing a nation's geographical and cultural data
 */
export default class FaqsModel {
  public readonly answer: Record<string, string>;
  public readonly question: Record<string, string>;

  constructor(data: {
    answer: Record<string, string>;
    question: Record<string, string>;
  }) {
    this.answer = data.answer;
    this.question = data.question;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns FaqsModel instance
   */
  static fromJson(json: any): FaqsModel {
    if (!json) {
      throw new Error("Cannot create FaqsModel from null or undefined");
    }

    return new FaqsModel({
      answer: json.answer,
      question: json.question,
    });
  }

  static example: FaqsModel = new FaqsModel({
    answer: {
      en: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      ar: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      fr: "lorem ipsum dolor sit amet consectetur adipiscing elit",
    },
    question: {
      en: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      ar: "lorem ipsum dolor sit amet consectetur adipiscing elit",
      fr: "lorem ipsum dolor sit amet consectetur adipiscing elit",
    },
  });
}
