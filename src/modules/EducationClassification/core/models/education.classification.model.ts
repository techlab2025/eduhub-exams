/**
 * Education Classification model representing a category of education
 */
export default class EducationClassificationModel {
  public readonly id: number;
  public readonly title: string;
  public readonly created_at: string;
  public readonly status: boolean;
  public readonly has_configuration: boolean;
  public readonly has_configuration_subjct: boolean;
  public readonly titles: Record<string, string>[];

  constructor(data: {
    id: number;
    title: string;
    created_at: string;
    status: boolean;
    has_configuration: boolean;
    has_configuration_subjct: boolean;
    titles: Record<string, string>[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.created_at = data.created_at;
    this.status = data.status;
    this.has_configuration = data.has_configuration;
    this.has_configuration_subjct = data.has_configuration_subjct;
    this.titles = data.titles;

    Object.freeze(this);
  }

  /**
   * Create EducationClassificationModel from API response
   * @param json - Raw JSON data from API
   * @returns EducationClassificationModel instance
   */
  static fromJson(json: Record<string, unknown>): EducationClassificationModel {
    if (!json) {
      throw new Error('Cannot create EducationClassificationModel from null or undefined');
    }

    return new EducationClassificationModel({
      id: json.id as number,
      title: json.title as string,
      created_at: json.created_at as string,
      status: EducationClassificationModel.parseStatus(json.is_active),
      has_configuration: json.has_configurations as boolean,
      has_configuration_subjct: json.has_configuration_subjct as boolean,
      titles: json.titles as Record<string, string>[],
    });
  }

  private static parseStatus(status: unknown): boolean {
    if (typeof status === 'boolean') return status;
    if (typeof status === 'number') return status === 1;
    if (typeof status === 'string') {
      return ['1', 'true', 'active'].includes(status.toLowerCase());
    }

    return false;
  }

  static example: EducationClassificationModel = new EducationClassificationModel({
    id: 1,
    title: 'Basic education',
    created_at: '2022-01-01',
    status: true,
    has_configuration: true,
    has_configuration_subjct: true,
    titles: [],
  });
}
