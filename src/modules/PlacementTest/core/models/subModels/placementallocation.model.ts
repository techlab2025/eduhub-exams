import type { PlacementDifficultyLevelEnum } from '../../constant/placement.difficulty.level.enum';

export class PlacemntAllocationQuestionModel {
  public readonly time?: number;
  public readonly difficultyLevel?: PlacementDifficultyLevelEnum;
  public readonly correctStatus?: number;
  public readonly questionNumber?: number;

  constructor(data: {
    time?: number;
    difficultyLevel?: PlacementDifficultyLevelEnum;
    correctStatus?: number;
    questionNumber?: number;
  }) {
    this.time = data.time;
    this.difficultyLevel = data.difficultyLevel;
    this.correctStatus = data.correctStatus;
    this.questionNumber = data.questionNumber;
  }

  static fromJson(json: any): PlacemntAllocationQuestionModel {
    if (!json) {
      throw new Error('Cannot create PlacemntAllocationQuestionModel from null or undefined');
    }

    return new PlacemntAllocationQuestionModel({
      time: json.time,
      difficultyLevel: json.difficulty_level,
      correctStatus: json.correct_status,
      questionNumber: json.question_number,
    });
  }
}

export default class PlacemntAllocationModel {
  public readonly id?: number;
  public readonly allTime?: PlacemntAllocationQuestionModel[];
  public readonly totalQuestions?: number;
  public readonly Easy?: number;
  public readonly totalnumberEasy?: number;
  public readonly Medium?: number;
  public readonly totalnumberMedium?: number;
  public readonly Hard?: number;
  public readonly totalnumberHard?: number;

  constructor(data: {
    id?: number;
    allTime?: PlacemntAllocationQuestionModel[];
    totalQuestions?: number;
    Easy?: number;
    totalnumberEasy?: number;
    Medium?: number;
    totalnumberMedium?: number;
    Hard?: number;
    totalnumberHard?: number;
  }) {
    this.id = data.id;
    this.allTime = data.allTime;
    this.totalQuestions = data.totalQuestions;
    this.Easy = data.Easy;
    this.totalnumberEasy = data.totalnumberEasy;
    this.Medium = data.Medium;
    this.totalnumberMedium = data.totalnumberMedium;
    this.Hard = data.Hard;
    this.totalnumberHard = data.totalnumberHard;
  }

  static fromJson(json: any): PlacemntAllocationModel {
    if (!json) {
      throw new Error('Cannot create PlacemntAllocationModel from null or undefined');
    }

    return new PlacemntAllocationModel({
      id: json.id,
      allTime: json.allTime?.map((item: any) => PlacemntAllocationQuestionModel.fromJson(item)),
      totalQuestions: json.total_questions,
      Easy: json.easy,
      totalnumberEasy: json.totalnumber_easy,
      Medium: json.medium,
      totalnumberMedium: json.totalnumber_medium,
      Hard: json.hard,
      totalnumberHard: json.totalnumber_hard,
    });
  }

  static example: PlacemntAllocationModel = new PlacemntAllocationModel({
    id: 1,
    allTime: [
      new PlacemntAllocationQuestionModel({
        time: 15,
        difficultyLevel: 3,
        correctStatus: 0,
        questionNumber: 1,
      }),
      new PlacemntAllocationQuestionModel({
        time: 32,
        difficultyLevel: 2,
        correctStatus: 1,
        questionNumber: 2,
      }),
      new PlacemntAllocationQuestionModel({
        time: 46,
        difficultyLevel: 1,
        correctStatus: 1,
        questionNumber: 3,
      }),
      new PlacemntAllocationQuestionModel({
        time: 46,
        difficultyLevel: 2,
        correctStatus: 1,
        questionNumber: 4,
      }),
    ],
    totalQuestions: 4,
    Easy: 20,
    totalnumberEasy: 20,
    Medium: 55,
    totalnumberMedium: 60,
    Hard: 10,
    totalnumberHard: 20,
  });
}
