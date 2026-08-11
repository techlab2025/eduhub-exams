import { DurationTypeEnum } from '@/modules/EducationClassification/core/constant/duration.type.enum';

export default class PlanPricingModel {
  public readonly price: number;
  public readonly duration: number;
  public readonly durationType: DurationTypeEnum;

  constructor(data: { price: number; duration: number; durationType: DurationTypeEnum }) {
    this.price = data.price;
    this.duration = data.duration;
    this.durationType = data.durationType;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, any>) {
    return new PlanPricingModel({
      price: Number(json.price ?? 0),
      duration: Number(json.duration ?? 0),
      durationType: json.duration_type,
    });
  }

  static readonly example = PlanPricingModel.fromJson({ id: 1, title: 'Premium', price: 100 });
}
