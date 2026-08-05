export default class StudentExamPerformanceModel {
  public readonly examNumber?: number;
  public readonly label?: string;
  public readonly score?: number;
  public readonly tone?: string;

  constructor(data: { examNumber?: number; label?: string; score?: number; tone?: string }) {
    this.examNumber = data.examNumber;
    this.label = data.label;
    this.score = data.score;
    this.tone = data.tone;
    Object.freeze(this);
  }

  static fromJson(json: any): StudentExamPerformanceModel {
    return new StudentExamPerformanceModel({
      examNumber: json.exam_number,
      label: json.label,
      score: json.score,
      tone: json.tone,
    });
  }

  static examples = [
    new StudentExamPerformanceModel({ examNumber: 1, label: 'First', score: 40, tone: 'warning' }),
    new StudentExamPerformanceModel({ examNumber: 2, label: 'Second', score: 30, tone: 'warning' }),
    new StudentExamPerformanceModel({ examNumber: 3, label: 'Third', score: 58, tone: 'success' }),
    new StudentExamPerformanceModel({ examNumber: 4, label: 'Fourth', score: 54, tone: 'success' }),
    new StudentExamPerformanceModel({ examNumber: 5, label: 'Fifth', score: 8, tone: 'danger' }),
  ];
}
