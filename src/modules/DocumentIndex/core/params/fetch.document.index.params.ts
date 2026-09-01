import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class FetchDocumentIndexParams implements Params {
  public readonly transactionId: string;

  public static readonly validation = new ClassValidation().setRules({
    transactionId: { required: true, minLength: 1 },
  });

  constructor(transactionId: string) {
    this.transactionId = transactionId;
  }

  toMap(): Record<string, string> {
    return { transaction_id: this.transactionId };
  }

  validate() {
    return FetchDocumentIndexParams.validation.validate(this);
  }

  validateOrThrow() {
    return FetchDocumentIndexParams.validation.validateOrThrow(this);
  }
}
