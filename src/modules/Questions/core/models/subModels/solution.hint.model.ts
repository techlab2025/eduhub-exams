export default class SolutionHintModel {
  public readonly id?: number;
  public readonly hint: string;
  public readonly image: string;

  constructor(data: { id?: number; hint?: string; image?: string }) {
    this.id = data.id;
    this.hint = data.hint || '';
    this.image = data.image || '';
    Object.freeze(this);
  }

  static fromJson(json: any): SolutionHintModel {
    if (!json) {
      throw new Error('Cannot create AnswerModel from null or undefined');
    }

    return new SolutionHintModel({
      id: json.id,
      hint: json.hint,
      image: json.image,
    });
  }

  static example: SolutionHintModel = new SolutionHintModel({
    id: 1,
    hint: 'Cairo',
    image: 'https://example.com/cairo.jpg',
  });
}
