/**
 * Country model representing a nation's geographical and cultural data
 */
export default class FaqsModel {
  public readonly title: string;

  constructor(data: { title: string }) {
    this.title = data.title;

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
      title: json.title,
    });
  }

  static example: FaqsModel = new FaqsModel({
    title: "lorem ipsum dolor sit amet consectetur adipiscing elit",
  });
}
