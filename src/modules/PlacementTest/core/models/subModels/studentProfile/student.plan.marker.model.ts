export default class StudentPlanMarkerModel {
  public readonly title?: string;
  public readonly examNumber?: number;
  public readonly tone?: string;

  constructor(data: { title?: string; examNumber?: number; tone?: string }) {
    this.title = data.title;
    this.examNumber = data.examNumber;
    this.tone = data.tone;
    Object.freeze(this);
  }

  static fromJson(json: any): StudentPlanMarkerModel {
    return new StudentPlanMarkerModel({
      title: json.title,
      examNumber: json.exam_number,
      tone: json.tone,
    });
  }

  static examples = [
    new StudentPlanMarkerModel({ title: 'First Plan', examNumber: 2, tone: 'success' }),
    new StudentPlanMarkerModel({ title: 'Second Plan', examNumber: 4, tone: 'success' }),
    new StudentPlanMarkerModel({ title: 'Third Plan', examNumber: 6, tone: 'danger' }),
  ];
}
