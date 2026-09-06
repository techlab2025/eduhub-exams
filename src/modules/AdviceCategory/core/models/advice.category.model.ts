export type AdviceCategoryTitle = Record<string, string> | Array<Record<string, unknown>> | string;

export default class AdviceCategoryModel {
  public readonly id: number;
  public readonly title: string;
  public readonly translations: Record<string, string>;
  public readonly createdAt: string;
  public readonly status: boolean | null;

  constructor(data: {
    id: number;
    title: string;
    translations: Record<string, string>;
    createdAt?: string;
    status?: boolean | null;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.translations = data.translations;
    this.createdAt = data.createdAt ?? '';
    this.status = data.status ?? null;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): AdviceCategoryModel {
    const rawTitle = (json.title ?? '') as AdviceCategoryTitle;
    return new AdviceCategoryModel({
      id: Number(json.id ?? json.advice_category_id),
      title: this.resolveTitle(rawTitle),
      translations: this.mapTranslations(rawTitle),
      createdAt: String(json.created_at ?? json.added_date ?? json.createdAt ?? ''),
      status: this.resolveStatus(json.status ?? json.is_active ?? json.active),
    });
  }

  private static resolveStatus(status: unknown): boolean | null {
    if (status === true || status === 1 || status === '1' || status === 'active') return true;
    if (status === false || status === 0 || status === '0' || status === 'inactive') return false;
    return null;
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
