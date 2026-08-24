export type LocalizedAdviceField = Record<string, string> | Array<Record<string, string>> | string;

export interface AdviceCategoryReference {
  id: number;
  title: string;
}

export default class AdviceModel {
  public readonly id: number;
  public readonly title: LocalizedAdviceField;
  public readonly description: LocalizedAdviceField;
  public readonly adviceCategory: AdviceCategoryReference | null;

  constructor(data: {
    id: number;
    title: LocalizedAdviceField;
    description: LocalizedAdviceField;
    adviceCategory?: AdviceCategoryReference | null;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.adviceCategory = data.adviceCategory ?? null;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): AdviceModel {
    const category = json.advice_category ?? json.category;
    const categoryId = Number(
      json.advice_category_id ??
        (category && typeof category === 'object'
          ? (category as Record<string, unknown>).id
          : undefined),
    );
    return new AdviceModel({
      id: Number(json.id ?? json.advice_id),
      title: (json.title ?? '') as LocalizedAdviceField,
      description: (json.description ?? '') as LocalizedAdviceField,
      adviceCategory:
        Number.isFinite(categoryId) && categoryId > 0
          ? {
              id: categoryId,
              title:
                category && typeof category === 'object'
                  ? String((category as Record<string, unknown>).title ?? '')
                  : '',
            }
          : null,
    });
  }

  static readonly example = new AdviceModel({
    id: 1,
    title: 'Study consistently',
    description: 'Review a small amount every day.',
    adviceCategory: { id: 1, title: 'Study planning' },
  });
}
