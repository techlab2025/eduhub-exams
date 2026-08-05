import TitleInterface from '@/base/Data/Models/titleInterface';

export default class PlacementSkillAnalysisModel {
  public readonly skill?: TitleInterface<number>;
  public readonly precentage?: number;

  constructor(data: { skill?: TitleInterface<number>; precentage?: number }) {
    this.skill = data.skill;
    this.precentage = data.precentage;
  }

  static fromJson(json: any): PlacementSkillAnalysisModel {
    if (!json) {
      throw new Error('Cannot create PlacementSkillAnalysisModel from null or undefined');
    }

    return new PlacementSkillAnalysisModel({
      skill: json.skill
        ? new TitleInterface({
            id: json.skill.id ?? json.skill.skill_id,
            title: json.skill.title,
          })
        : undefined,
      precentage: json.percentage ?? json.precentage,
    });
  }

  static example: PlacementSkillAnalysisModel = new PlacementSkillAnalysisModel({
    skill: new TitleInterface({ id: 1, title: 'Understanding' }),
    precentage: 90,
  });
}
