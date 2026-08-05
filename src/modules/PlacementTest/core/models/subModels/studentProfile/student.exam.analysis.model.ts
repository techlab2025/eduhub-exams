export default class StudentExamAnalysisModel {
  public readonly bestScore?: number;
  public readonly bestExamId?: number;
  public readonly lowestScore?: number;
  public readonly lowestExamId?: number;
  public readonly averageScore?: number;
  public readonly performanceDeclining?: boolean;

  constructor(data: {
    bestScore?: number;
    bestExamId?: number;
    lowestScore?: number;
    lowestExamId?: number;
    averageScore?: number;
    performanceDeclining?: boolean;
  }) {
    this.bestScore = data.bestScore;
    this.bestExamId = data.bestExamId;
    this.lowestScore = data.lowestScore;
    this.lowestExamId = data.lowestExamId;
    this.averageScore = data.averageScore;
    this.performanceDeclining = data.performanceDeclining;
    Object.freeze(this);
  }

  static fromJson(json: any): StudentExamAnalysisModel {
    return new StudentExamAnalysisModel({
      bestScore: json.best_score,
      bestExamId: json.best_exam_id,
      lowestScore: json.lowest_score,
      lowestExamId: json.lowest_exam_id,
      averageScore: json.average_score,
      performanceDeclining: json.performance_declining,
    });
  }

  static example = new StudentExamAnalysisModel({
    bestScore: 92,
    bestExamId: 12,
    lowestScore: 48,
    lowestExamId: 14,
    averageScore: 74,
    performanceDeclining: true,
  });
}
