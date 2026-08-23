import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';

export default class QuestionBatchCreatorModel {
  public readonly id: number;
  public readonly name: string;

  constructor(data: { id: number; name: string }) {
    this.id = data.id;
    this.name = data.name;
    Object.freeze(this);
  }

  static fromJson(json: unknown): QuestionBatchCreatorModel {
    const data = SaftyConditions.objectValue(json);
    return new QuestionBatchCreatorModel({
      id: SaftyConditions.numberValue(data.id),
      name: String(data.name ?? data.title ?? ''),
    });
  }
}
