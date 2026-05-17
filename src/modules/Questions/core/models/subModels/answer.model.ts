export default class AnswerModel {
  public readonly id?: number;
  public readonly answer: string;
  public readonly image: string;

  constructor(data: { id?: number; answer?: string; image?: string }) {
    this.id = data.id;
    this.answer = data.answer || '';
    this.image = data.image || '';
    Object.freeze(this);
  }

  static fromJson(json: any): AnswerModel {
    if (!json) {
      throw new Error('Cannot create AnswerModel from null or undefined');
    }

    return new AnswerModel({
      id: json.id,
      answer: json.answer,
      image: json.image,
    });
  }

  static example: AnswerModel = new AnswerModel({
    id: 1,
    answer: 'Cairo',
    image: 'https://example.com/cairo.jpg',
  });
}
