import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class AddDocumentDocumentParams implements Params {
  public title: string;
  public documentTypeId: number;
  public isMaster: boolean;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 255 },
    documentTypeId: { required: true },
    isMaster: { required: true },
  });

  constructor(data: { title: string; documentTypeId: number; isMaster: boolean }) {
    this.title = data.title;
    this.documentTypeId = data.documentTypeId;
    this.isMaster = data.isMaster;
  }

  toMap(): { [p: string]: any } {
    return {
      title: this.title,
      document_type_id: this.documentTypeId,
      is_master: this.isMaster,
    };
  }

  validate() {
    return AddDocumentDocumentParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddDocumentDocumentParams.validation.validateOrThrow(this);
  }
}
