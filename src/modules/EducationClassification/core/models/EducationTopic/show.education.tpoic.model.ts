export default class ShowEducationTopicModel {
  public readonly id: number;
  public readonly title: string;

  constructor(data: { id: number; title?: string }) {
    this.id = data.id;

    this.title = data.title ?? '';
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): ShowEducationTopicModel {
    if (!json) {
      throw new Error('Cannot create EducationSkillsModel from null or undefined');
    }
    return new ShowEducationTopicModel({
      id: json.id as number,
      title: json.title as string,
    });
  }

  static example: ShowEducationTopicModel = new ShowEducationTopicModel({
    id: 1,
    title: 'Math',
  });
}
