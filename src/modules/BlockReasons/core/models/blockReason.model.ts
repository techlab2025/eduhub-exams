export type LocalizedField = Record<string, string> | Array<Record<string, string>> | string;

export default class BlockReasonModel {
  public readonly id: number;
  public readonly title: LocalizedField;
  public readonly titles?: LocalizedField[];

  constructor(data: { id: number; title: LocalizedField; titles?: LocalizedField[] }) {
    this.id = data.id;
    this.title = data.title;
    this.titles = data.titles;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): BlockReasonModel {
    return new BlockReasonModel({
      id: Number(json.id ?? json.block_reason_id),
      title: (json.title ?? '') as LocalizedField,
      titles: json.titles as LocalizedField[],
    });
  }

  static readonly example = new BlockReasonModel({ id: 1, title: 'Policy violation' });
}
