export default class EducationStageModel {
  public readonly stage_id: number;
  public readonly stage_title: string;
  public readonly has_children: boolean;

  constructor(data: { stage_id: number; stage_title: string; has_children: boolean }) {
    this.stage_id = data.stage_id;
    this.stage_title = data.stage_title;
    this.has_children = data.has_children;

    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): EducationStageModel {
    if (!json) {
      throw new Error('Cannot create BranchesModel from null or undefined');
    }

    return new EducationStageModel({
      stage_id: json.stage_id as number,
      stage_title: json.stage_title as string,
      has_children: json.has_children as boolean,
    });
  }
}
