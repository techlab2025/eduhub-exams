export default class PlanActiveLogUserModel {
  public readonly id: number;
  public readonly name: string;

  constructor(data: { id: number; name: string }) {
    this.id = data.id;
    this.name = data.name;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanActiveLogUserModel({
      id: Number(json.id ?? 0),
      name: String(json.name ?? ''),
    });
  }

  static readonly example = PlanActiveLogUserModel.fromJson({ id: 1, name: 'Ahmed Hawam' });
}
