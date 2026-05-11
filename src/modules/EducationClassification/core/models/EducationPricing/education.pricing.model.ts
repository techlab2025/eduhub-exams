/**
 * Education Pricing model representing a category of education
 */
export default class EducationPricingModel {
  public readonly id: number;
  public readonly title: string;

  constructor(data: { id: number; title: string }) {
    this.id = data.id;
    this.title = data.title;

    Object.freeze(this);
  }

  /**
   * Create EducationClassificationModel from API response
   * @param json - Raw JSON data from API
   * @returns EducationClassificationModel instance
   */
  static fromJson(json: Record<string, unknown>): EducationPricingModel {
    if (!json) {
      throw new Error('Cannot create EducationClassificationModel from null or undefined');
    }

    return new EducationPricingModel({
      id: json.id as number,
      title: json.title as string,
    });
  }

  static example: EducationPricingModel = new EducationPricingModel({
    id: 1,
    title: 'Basic education',
  });
}
