import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';

export default class DocumentIndexSourcePagesModel {
  public readonly start: number;
  public readonly end: number;

  constructor(data: { start: number; end: number }) {
    this.start = data.start;
    this.end = data.end;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexSourcePagesModel {
    const data = SaftyConditions.objectValue(json);
    return new DocumentIndexSourcePagesModel({
      start: SaftyConditions.numberValue(data.start),
      end: SaftyConditions.numberValue(data.end),
    });
  }
}
