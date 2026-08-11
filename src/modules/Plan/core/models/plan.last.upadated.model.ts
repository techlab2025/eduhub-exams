import PlanLastUpdatePersondModel from './plan.last.upadated.person.model';

export default class PlanLastUpdatedModel {
  public readonly lastupdatedBy: PlanLastUpdatePersondModel;
  public readonly date?: string;

  constructor(data: { lastupdatedBy: PlanLastUpdatePersondModel; date?: string }) {
    this.lastupdatedBy = data.lastupdatedBy;
    this.date = data.date;
    Object.freeze(this);
  }

  static fromJson(json?: Record<string, any> | null) {
    const safeJson = json ?? {};
    const person = safeJson.last_updated_person ?? safeJson.lastupdatedBy ?? safeJson.person ?? {};

    return new PlanLastUpdatedModel({
      lastupdatedBy: PlanLastUpdatePersondModel.fromJson(person),
      date: safeJson.last_updated_date ?? safeJson.date ?? undefined,
    });
  }

  static readonly example = PlanLastUpdatedModel.fromJson({
    last_updated_person: PlanLastUpdatePersondModel.example,
    date: '2023-01-01',
  });
}
