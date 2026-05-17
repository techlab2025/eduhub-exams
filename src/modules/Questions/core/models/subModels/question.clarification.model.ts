import type TitleInterface from '@/base/Data/Models/titleInterface';

export default class QuestionClarificationModel {
  public readonly documents?: TitleInterface<number>;
  public readonly source?: string;
  public readonly clarification?: string;
  public readonly file?: string;

  constructor(data: {
    documents?: TitleInterface<number>;
    source?: string;
    clarification?: string;
    file?: string;
  }) {
    this.documents = data.documents;
    this.source = data.source || '';
    this.clarification = data.clarification || '';
    this.file = data.file || '';
    Object.freeze(this);
  }

  static fromJson(json: any): QuestionClarificationModel {
    if (!json) {
      throw new Error('Cannot create AnswerModel from null or undefined');
    }

    return new QuestionClarificationModel({
      documents: json.documents,
      source: json.source,
      clarification: json.clarification,
      file: json.file,
    });
  }

  static example: QuestionClarificationModel = new QuestionClarificationModel({
    documents: {
      id: 1,
      title: 'Source',
    },
    source: 'Source',
    clarification: 'Clarification',
    file: 'File',
  });
}
