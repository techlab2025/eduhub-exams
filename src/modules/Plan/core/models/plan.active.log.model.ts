import PlanActiveLogUserModel from './plan.active.log.user.model';

export default class PlanActiveLogModel {
  public readonly user: PlanActiveLogUserModel;
  public readonly date: string;
  public readonly text: string;

  constructor(data: { user: PlanActiveLogUserModel; date: string; text: string }) {
    this.user = data.user;
    this.date = data.date;
    this.text = data.text;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanActiveLogModel({
      user: PlanActiveLogUserModel.fromJson((json.user ?? {}) as Record<string, unknown>),
      date: String(json.date ?? ''),
      text: String(json.text ?? ''),
    });
  }

  static readonly example = PlanActiveLogModel.fromJson({
    user: PlanActiveLogUserModel.example,
    date: '2026-07-05',
    text: 'Updated plan pricing',
  });
}
