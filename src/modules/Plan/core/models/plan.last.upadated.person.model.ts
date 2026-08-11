export default class PlanLastUpdatePersondModel {
  public readonly id: number;
  public readonly name: string;

  constructor(data: { id: number; name: string }) {
    this.id = data.id;
    this.name = data.name;
  }

  static fromJson(json?: Record<string, any> | null) {
    const safeJson = json ?? {};

    return new PlanLastUpdatePersondModel({
      id: Number(safeJson.id ?? safeJson.user_id ?? 0),
      name: String(safeJson.name ?? safeJson.full_name ?? ''),
    });
  }

  static readonly example = PlanLastUpdatePersondModel.fromJson({
    id: 1,
    name: 'Mohab Mohamed',
  });
}
