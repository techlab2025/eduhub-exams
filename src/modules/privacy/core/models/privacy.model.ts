/**
 * Country model representing a nation's geographical and cultural data
 */
export default class PrivacyModel {
  public readonly id: number;
  public readonly title: Record<string, string>[];
  public readonly description: Record<string, string>[];

  constructor(data: {
    id: number;
    title: Record<string, string>[];
    description: Record<string, string>[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns FaqsModel instance
   */
  static fromJson(json: any): PrivacyModel {
    if (!json) {
      throw new Error('Cannot create FaqsModel from null or undefined');
    }

    return new PrivacyModel({
      id: json.id,
      title: json.title,
      description: json.description,
    });
  }

  static example: PrivacyModel = new PrivacyModel({
    id: 1,
    title: [
      {
        en: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        ar: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        fr: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      },
    ],
    description: [
      {
        en: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        ar: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        fr: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      },
    ],
  });
}
