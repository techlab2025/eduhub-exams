import DifficultyModel from './difficultyModel';

export default class PlacementModel {
  public readonly id?: number;
  public readonly numberOfQuestions?: number;
  public readonly time?: number;
  public readonly difficulties?: DifficultyModel;
  constructor(data: {
    id?: number;
    numberOfQuestions?: number;
    time?: number;
    difficulties?: DifficultyModel;
  }) {
    this.id = data.id;
    this.numberOfQuestions = data.numberOfQuestions;
    this.time = data.time;
    this.difficulties = data.difficulties;

    Object.freeze(this);
  }

  static fromJson(json: any): PlacementModel {
    if (!json) {
      throw new Error('Cannot create PlacementModel from null or undefined');
    }

    return new PlacementModel({
      id: json.id,
      numberOfQuestions: json.number_of_questions,
      time: json.time,
      difficulties: DifficultyModel.fromJson(json.difficulties),
    });
  }

  static example: PlacementModel = new PlacementModel({
    id: 5,
    numberOfQuestions: 20,
    time: 40,
    difficulties: DifficultyModel.example,
  });
}
