export default class StudentSkillProgressModel {
  public readonly examNumber?: number;
  public readonly percentage?: number;

  constructor(data: { examNumber?: number; percentage?: number }) {
    this.examNumber = data.examNumber;
    this.percentage = data.percentage;
    Object.freeze(this);
  }

  static fromJson(json: any): StudentSkillProgressModel {
    return new StudentSkillProgressModel({
      examNumber: json.exam_number,
      percentage: json.percentage,
    });
  }

  static examples = [
    new StudentSkillProgressModel({ examNumber: 1, percentage: 15 }),
    new StudentSkillProgressModel({ examNumber: 2, percentage: 30 }),
    new StudentSkillProgressModel({ examNumber: 3, percentage: 15 }),
    new StudentSkillProgressModel({ examNumber: 4, percentage: 15 }),
    new StudentSkillProgressModel({ examNumber: 5, percentage: 30 }),
    new StudentSkillProgressModel({ examNumber: 6, percentage: 48 }),
  ];
}
