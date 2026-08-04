import type { QuestionStatusEnum } from '../../constant/question.status.enum';

export default class HistoryStatusModel {
  public value?: QuestionStatusEnum;
  public name?: string;

  constructor(data: { value?: QuestionStatusEnum; name?: string }) {
    this.value = data.value;
    this.name = data.name || '';

    Object.freeze(this);
  }

  static fromJson(json: any): HistoryStatusModel {
    if (!json) {
      throw new Error('Cannot create AnswerModel from null or undefined');
    }

    return new HistoryStatusModel({
      value: json.value as QuestionStatusEnum,
      name: json.name,
    });
  }

  static example: HistoryStatusModel = new HistoryStatusModel({
    value: 1,
    name: 'name',
  });
}
