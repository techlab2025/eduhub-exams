export type LocalizedAdviceField = Record<string, string> | Array<Record<string, string>> | string;

export default class AdviceModel {
  public readonly id: number;
  public readonly title: LocalizedAdviceField;
  public readonly description: LocalizedAdviceField;

  constructor(data: {
    id: number;
    title: LocalizedAdviceField;
    description: LocalizedAdviceField;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): AdviceModel {
    return new AdviceModel({
      id: Number(json.id ?? json.advice_id),
      title: (json.title ?? '') as LocalizedAdviceField,
      description: (json.description ?? '') as LocalizedAdviceField,
    });
  }

  static readonly example = new AdviceModel({
    id: 1,
    title: 'Study consistently',
    description: 'Review a small amount every day.',
  });
}
