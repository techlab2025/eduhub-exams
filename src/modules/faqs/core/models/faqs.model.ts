export default class FaqsModel {
  public readonly id?: number;
  public readonly answer: any[];
  public readonly question: any[];

  constructor(data: {
    id?: number;
    answer: any[];
    question: any[];
  }) {
    this.id = data.id;
    this.answer = data.answer;
    this.question = data.question;

    Object.freeze(this);
  }

  static fromJson(json: any): FaqsModel {
    if (!json) {
      throw new Error('Cannot create FaqsModel from null or undefined');
    }

    return new FaqsModel({
      id: json.id,

      question: Array.isArray(json.question)
        ? json.question
        : [
            {
              locale: 'en',
              question: json.question ?? '',
            },
          ],

      answer: Array.isArray(json.answer)
        ? json.answer
        : [
            {
              locale: 'en',
              answer: json.answer ?? '',
            },
          ],
    });
  }
}