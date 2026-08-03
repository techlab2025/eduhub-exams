export default class DifficultyModel {
  public readonly easy?: number;
  public readonly medium?: number;
  public readonly hard?: number;
  constructor(data: { easy?: number; medium?: number; hard?: number }) {
    this.easy = data.easy;
    this.medium = data.medium;
    this.hard = data.hard;

    Object.freeze(this);
  }

  static fromJson(json: any): DifficultyModel {
    if (!json) {
      throw new Error('Cannot create DifficultyModel from null or undefined');
    }

    return new DifficultyModel({
      easy: json.easy,
      medium: json.medium,
      hard: json.hard,
    });
  }

  static example: DifficultyModel = new DifficultyModel({
    easy: 10,
    medium: 5,
    hard: 5,
  });
}
