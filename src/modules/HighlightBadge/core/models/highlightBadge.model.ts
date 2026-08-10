export type LocalizedField = Record<string, string> | Array<Record<string, string>> | string;

export default class HighlightBadgeModel {
  public readonly id: number;
  public readonly title: LocalizedField;

  constructor(data: { id: number; title: LocalizedField }) {
    this.id = data.id;
    this.title = data.title;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): HighlightBadgeModel {
    return new HighlightBadgeModel({
      id: Number(json.id ?? json.highlight_badge_id),
      title: (json.title ?? '') as LocalizedField,
    });
  }

  static readonly example = new HighlightBadgeModel({ id: 1, title: 'Popular' });
}
