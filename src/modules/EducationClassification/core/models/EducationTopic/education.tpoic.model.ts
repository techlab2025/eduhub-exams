export default class EducationTopicModel {
  public readonly id: number;
  public readonly title: Record<string, string>;

  constructor(data: { id: number; title?: Record<string, string> }) {
    this.id = data.id;

    this.title = data.title ?? { title: '' };
    Object.freeze(this);
  }

  static fromJson(json: Record<string, any>): EducationTopicModel {
    if (!json) {
      throw new Error('Cannot create EducationSkillsModel from null or undefined');
    }
    return new EducationTopicModel({
      id: json.id as number,
      title: this.mapTranslations(json.titles, 'title'),
    });
  }

  static example: EducationTopicModel = new EducationTopicModel({
    id: 1,

    title: { title: 'Math' },
  });

  static mapTranslations = (translations: any[], key: string = 'value') => {
    const result: Record<string, string> = {};
    if (Array.isArray(translations)) {
      translations.forEach((t: any) => {
        if (t.locale && t[key]) {
          result[t.locale] = t[key];
        }
      });
    }
    return result;
  };
}
