import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import QuestionBatchEducationChildModel from './question.batch.education.child.model';

export default class QuestionBatchEducationTypeModel {
  public readonly id: number;
  public readonly title: string;
  public readonly children: QuestionBatchEducationChildModel[];

  constructor(data: { id: number; title: string; children: QuestionBatchEducationChildModel[] }) {
    this.id = data.id;
    this.title = data.title;
    this.children = data.children;
    Object.freeze(this);
  }

  static fromJson(json: unknown): QuestionBatchEducationTypeModel {
    const data = SaftyConditions.objectValue(json);
    return new QuestionBatchEducationTypeModel({
      id: SaftyConditions.numberValue(data.id),
      title: String(data.title ?? ''),
      children: Array.isArray(data.children)
        ? data.children.map(QuestionBatchEducationChildModel.fromJson)
        : [],
    });
  }
}
