/**
 * Privacy model for managing privacy policy data
 */
export default class PrivacyModel {
  public readonly id: number;
  public readonly title: unknown[];
  public readonly description: unknown[];

  constructor(data: { id: number; title: unknown[]; description: unknown[] }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;

    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): PrivacyModel {
    if (!json) {
      throw new Error('Cannot create PrivacyModel from null or undefined');
    }

    const mapToLocaleArray = (data: unknown, key: string) => {
      if (Array.isArray(data)) return data;
      if (typeof data === 'object' && data !== null) {
        return Object.entries(data as Record<string, unknown>).map(([locale, value]) => ({
          locale,
          [key]: value as string,
        }));
      }
      return [{ locale: 'en', [key]: data ?? '' }];
    };

    const translations = (json.translations || {}) as Record<string, unknown>;
    const titleData = translations.title ?? json.title;
    const descriptionData = translations.description ?? json.description;

    return new PrivacyModel({
      id: json.id as number,
      title: mapToLocaleArray(titleData, 'title'),
      description: mapToLocaleArray(descriptionData, 'description'),
    });
  }

  static example: PrivacyModel = new PrivacyModel({
    id: 1,
    title: [{ locale: 'en', title: 'Privacy Policy' }],
    description: [{ locale: 'en', description: 'Description here' }],
  });
}
