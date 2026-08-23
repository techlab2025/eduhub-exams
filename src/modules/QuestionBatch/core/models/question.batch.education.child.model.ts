import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';

export default class QuestionBatchEducationChildModel {
  public readonly id: number;
  public readonly title: string;

  constructor(data: { id: number; title: string }) {
    this.id = data.id;
    this.title = data.title;
    Object.freeze(this);
  }

  static fromJson(json: unknown): QuestionBatchEducationChildModel {
    const data = SaftyConditions.objectValue(json);
    return new QuestionBatchEducationChildModel({
      id: SaftyConditions.numberValue(data.id),
      title: String(data.title ?? ''),
    });
  }
}
