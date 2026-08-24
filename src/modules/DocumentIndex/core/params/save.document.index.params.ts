import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class SaveDocumentIndexParams implements Params {
  public readonly documentId: number;

  public static readonly validation = new ClassValidation().setRules({
    documentId: { required: true, min: 1 },
  });

  constructor(documentId: number) {
    this.documentId = documentId;
  }

  toMap(): Record<string, number> {
    return { document_id: this.documentId };
  }

  validate() {
    return SaveDocumentIndexParams.validation.validate(this);
  }

  validateOrThrow() {
    return SaveDocumentIndexParams.validation.validateOrThrow(this);
  }
}
