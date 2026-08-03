import { PlacementTotalRateEnum } from '../../constant/placment.total.rate.enum';

export default class ResultAnalysisModel {
  public readonly correct?: number;
  public readonly wrong?: number;
  public readonly Skipped?: number;
  public readonly totalRate?: PlacementTotalRateEnum;
  public readonly precentage?: number;

  constructor(data: {
    correct?: number;
    wrong?: number;
    Skipped?: number;
    totalRate?: PlacementTotalRateEnum;
    precentage?: number;
  }) {
    this.correct = data.correct;
    this.wrong = data.wrong;
    this.Skipped = data.Skipped;
    this.totalRate = data.totalRate;
    this.precentage = data.precentage;
  }

  static fromJson(json: any): ResultAnalysisModel {
    if (!json) {
      throw new Error('Cannot create ResultAnalysisModel from null or undefined');
    }

    return new ResultAnalysisModel({
      correct: json.correct,
      wrong: json.wrong,
      Skipped: json.Skipped,
      totalRate: json.total_rate ?? json.totalRate,
      precentage: json.precentage,
    });
  }

  static example: ResultAnalysisModel = new ResultAnalysisModel({
    correct: 40,
    wrong: 10,
    Skipped: 0,
    totalRate: PlacementTotalRateEnum.excellent,
    precentage: 80,
  });
}
