export default class SolutionStepsModel {
  public readonly id?: number;
  public readonly step: string;
  public readonly image: string;

  constructor(data: { id?: number; step?: string; image?: string }) {
    this.id = data.id;
    this.step = data.step || '';
    this.image = data.image || '';
    Object.freeze(this);
  }

  static fromJson(json: any): SolutionStepsModel {
    if (!json) {
      throw new Error('Cannot create AnswerModel from null or undefined');
    }

    return new SolutionStepsModel({
      id: json.id,
      step: json.step,
      image: json.image,
    });
  }

  static example: SolutionStepsModel = new SolutionStepsModel({
    id: 1,
    step: 'Cairo',
    image: 'https://example.com/cairo.jpg',
  });
}
