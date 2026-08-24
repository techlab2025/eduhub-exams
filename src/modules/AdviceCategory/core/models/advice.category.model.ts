export type AdviceCategoryTitle = Record<string, string> | Array<Record<string, unknown>> | string;

export default class AdviceCategoryModel {
  public readonly id: number;
  public readonly title: string;
  public readonly translations: Record<string, string>;

  constructor(data: { id: number; title: string; translations: Record<string, string> }) {
    this.id = data.id;
    this.title = data.title;
    this.translations = data.translations;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): AdviceCategoryModel {
    const rawTitle = (json.title ?? '') as AdviceCategoryTitle;
    return new AdviceCategoryModel({
      id: Number(json.id ?? json.advice_category_id),
      title: this.resolveTitle(rawTitle),
      translations: this.mapTranslations(rawTitle),
    });
  }

  private static resolveTitle(title: AdviceCategoryTitle): string {
    if (typeof title === 'string') return title;
    if (!Array.isArray(title)) return title.en ?? title.ar ?? '';
    const firstTitle = title.find((item) => typeof item.title === 'string');
    return String(firstTitle?.title ?? '');
  }

  private static mapTranslations(title: AdviceCategoryTitle): Record<string, string> {
    if (typeof title === 'string') return {};
    if (!Array.isArray(title)) return title;
    return Object.fromEntries(
      title
        .filter((item) => item.locale && typeof item.title === 'string')
        .map((item) => [String(item.locale), String(item.title)]),
    );
  }

  static readonly example = new AdviceCategoryModel({
    id: 1,
    title: 'Study planning',
    translations: { en: 'Study planning', ar: 'التخطيط للدراسة' },
  });
}
