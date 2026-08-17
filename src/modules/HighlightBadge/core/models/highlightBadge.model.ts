export type LocalizedField = Record<string, string> | Array<Record<string, string>> | string;

export default class HighlightBadgeModel {
  public readonly id: number;
  public readonly title: LocalizedField;
  public readonly titles?: LocalizedField[];
  public readonly hasPlan: boolean;

  constructor(data: {
    id: number;
    title: LocalizedField;
    titles?: LocalizedField[];
    hasPlan: boolean;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.titles = data.titles;
    this.hasPlan = data.hasPlan;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): HighlightBadgeModel {
    return new HighlightBadgeModel({
      id: Number(json.id ?? json.highlight_badge_id),
      title: (json.title ?? '') as LocalizedField,
      titles: json.titles as LocalizedField[],
      hasPlan: Boolean(json.has_plan),
    });
  }

  static readonly example = new HighlightBadgeModel({
    id: 1,
    title: 'Popular',
    hasPlan: true,
  });
}
