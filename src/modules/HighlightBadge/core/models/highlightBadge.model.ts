export type LocalizedField = Record<string, string> | Array<Record<string, string>> | string;

export default class HighlightBadgeModel {
  public readonly id: number;
  public readonly title: LocalizedField;
  public readonly titles?: LocalizedField[];

  constructor(data: { id: number; title: LocalizedField; titles?: LocalizedField[] }) {
    this.id = data.id;
    this.title = data.title;
    this.titles = data.titles;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): HighlightBadgeModel {
    return new HighlightBadgeModel({
      id: Number(json.id ?? json.highlight_badge_id),
      title: (json.title ?? '') as LocalizedField,
      titles: json.titles as LocalizedField[],
    });
  }

  static readonly example = new HighlightBadgeModel({ id: 1, title: 'Popular' });
}
