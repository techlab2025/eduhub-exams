import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class GenerateDocumentIndexParams implements Params {
  public readonly documentId: number;
  public readonly autoGenerate: boolean = false;

  public static readonly validation = new ClassValidation().setRules({
    documentId: { required: true, min: 1 },
  });

  constructor(documentId: number, autoGenerate: boolean = false) {
    this.documentId = documentId;
    this.autoGenerate = autoGenerate;
  }

  toMap(): Record<string, number | boolean> {
    return { document_id: this.documentId, auto_generate: this.autoGenerate };
  }

  validate() {
    return GenerateDocumentIndexParams.validation.validate(this);
  }

  validateOrThrow() {
    return GenerateDocumentIndexParams.validation.validateOrThrow(this);
  }
}
