export default class EducationSkillsModel {
  public readonly id: number;
  public readonly percentage: number;
  public readonly time: number;
  public readonly skillId: number;
  public readonly skillName: string;

  constructor(data: {
    id: number;
    percentage: number;
    time: number;
    skillId?: number;
    skillName?: string;
  }) {
    this.id = data.id;
    this.percentage = data.percentage;
    this.time = data.time;
    this.skillId = data.skillId ?? 0;
    this.skillName = data.skillName ?? '';
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): EducationSkillsModel {
    if (!json) {
      throw new Error('Cannot create EducationSkillsModel from null or undefined');
    }
    const skill = json.skill as Record<string, unknown> | undefined;
    return new EducationSkillsModel({
      id: json.id as number,
      percentage: json.percentage as number,
      time: json.time as number,
      skillId: ((skill?.id ?? json.skill_id) as number) ?? 0,
      skillName: ((skill?.name ?? json.skill_name ?? json.name) as string) ?? '',
    });
  }

  static example: EducationSkillsModel = new EducationSkillsModel({
    id: 1,
    percentage: 80,
    time: 60,
    skillId: 1,
    skillName: 'Math',
  });
}
