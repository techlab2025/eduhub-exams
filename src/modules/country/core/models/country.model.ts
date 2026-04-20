/**
 * Country model representing a nation's geographical and cultural data
 */
export default class CountryModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly code: string;
  public readonly flag: string;

  constructor(data: { id?: number; title: string; code: string; flag: string }) {
    this.id = data.id;
    this.title = data.title;
    this.code = data.code;
    this.flag = data.flag;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns CountryModel instance
   */
  static fromJson(json: any): CountryModel {
    if (!json) {
      throw new Error('Cannot create CountryModel from null or undefined');
    }

    return new CountryModel({
      id: json.id,
      title: json.title,
      code: json.code,
      flag: json.flag,
    });
  }

  static example: CountryModel = new CountryModel({
    id: 1,
    title: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
  });
}
