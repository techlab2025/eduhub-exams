/**
 * Employee model representing an employee entity
 */
export default class TranslationModel {
  public readonly title?: Record<string, string>;
  public readonly description?: Record<string, string>;

  constructor(data: { title?: Record<string, string>; description?: Record<string, string> }) {
    this.title = data.title;
    this.description = data.description;

    Object.freeze(this);
  }

  /**
   * Create EmployeeModel from API response
   * @param json - Raw JSON data from API
   * @returns EmployeeModel instance
   */
  static fromJson(json: any): TranslationModel {
    if (!json) {
      throw new Error('Cannot create EmployeeModel from null or undefined');
    }

    return new TranslationModel({
      title: json.title,
      description: json.description,
    });
  }

  static example: TranslationModel = new TranslationModel({
    title: {
      ar: '',
      en: '',
    },
    description: {
      ar: '',
      en: '',
    },
  });
}
