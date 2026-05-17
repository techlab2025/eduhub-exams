export default class QuestionDocumentModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly source: string;

  constructor(data: { id?: number; title?: string; source?: string }) {
    this.id = data.id;
    this.title = data.title || '';
    this.source = data.source || '';
    Object.freeze(this);
  }

  static fromJson(json: any): QuestionDocumentModel {
    if (!json) {
      throw new Error('Cannot create AnswerModel from null or undefined');
    }

    return new QuestionDocumentModel({
      id: json.id,
      title: json.title,
      source: json.source,
    });
  }

  static example: QuestionDocumentModel = new QuestionDocumentModel({
    id: 1,
    title: 'Cairo',
    source: 'Cairo',
  });
}
