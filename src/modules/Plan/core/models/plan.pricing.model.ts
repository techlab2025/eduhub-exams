import { PlanDurationTypeEnum } from '../enums/plan.duration.enum';

export default class PlanPricingModel {
  public readonly price: number;
  public readonly duration: number;
  public readonly durationType: PlanDurationTypeEnum;

  constructor(data: { price: number; duration: number; durationType: PlanDurationTypeEnum }) {
    this.price = data.price;
    this.duration = data.duration;
    this.durationType = data.durationType;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>) {
    return new PlanPricingModel({
      price: Number(json.price ?? 0),
      duration: Number(json.duration ?? 0),
      durationType: Number(json.duration_type ?? 0) as PlanDurationTypeEnum,
    });
  }

  static readonly example = PlanPricingModel.fromJson({
    price: 499,
    duration: 1,
    duration_type: PlanDurationTypeEnum.MONTH,
  });
}
