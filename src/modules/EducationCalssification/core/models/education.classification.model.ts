/**
 * Country model representing a nation's geographical and cultural data
 */
export default class EducationClassificationModel {
  public readonly id: number;
  public readonly title: string;
  public readonly created_at: string;
  public readonly status: boolean;

  constructor(data: { id: number; title: string; created_at: string; status: boolean }) {
    this.id = data.id;
    this.title = data.title;
    this.created_at = data.created_at;
    this.status = data.status;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns CountryModel instance
   */
  static fromJson(json: any): EducationClassificationModel {
    if (!json) {
      throw new Error('Cannot create CountryModel from null or undefined');
    }

    return new EducationClassificationModel({
      id: json.id,
      title: json.title,
      created_at: json.created_at,
      status: json.status,
    });
  }

  static example: EducationClassificationModel = new EducationClassificationModel({
    id: 1,
    title: 'Basic education',
    created_at: '2022-01-01',
    status: true,
  });
}
