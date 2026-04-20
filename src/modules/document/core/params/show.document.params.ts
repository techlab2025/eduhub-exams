import type Params from "@/base/Core/Params/params";
import { ClassValidation } from "@/base/Presentation/Utils/classValidation";

export default class ShowDocumentParams implements Params {
  public document_id: number;

  public static readonly validation = new ClassValidation().setRules({
    document_id: { required: true },
  });

  constructor(document_id: number) {
    this.document_id = document_id;
  }

  toMap(): { [p: string]: any } {
    return {
      document_id: this.document_id,
    };
  }

  validate() {
    return ShowDocumentParams.validation.validate(this);
  }

  validateOrThrow() {
    return ShowDocumentParams.validation.validateOrThrow(this);
  }
}
