import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class AddDocumentParams implements Params {
  public title: string;
  public subject_id: number;
  public stage_id: number;
  public unit_ids: number[];
  public document_type_id: number;
  public isAllUnits: boolean;

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 255 },
    subject_id: { required: true },
    stage_id: { required: true },
    document_type_id: { required: true },
  });

  constructor(data: {
    title: string;
    subject_id: number;
    stage_id: number;
    unit_ids: number[];
    document_type_id: number;
    isAllUnits: boolean;
  }) {
    this.title = data.title;
    this.subject_id = data.subject_id;
    this.stage_id = data.stage_id;
    this.unit_ids = data.unit_ids;
    this.document_type_id = data.document_type_id;
    this.isAllUnits = data.isAllUnits;
  }

  toMap(): { [p: string]: any } {
    return {
      title: this.title,
      subject_id: this.subject_id,
      stage_id: this.stage_id,
      unit_ids: this.unit_ids,
      document_type_id: this.document_type_id,
      isAllUnits: this.isAllUnits,
    };
  }

  validate() {
    return AddDocumentParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddDocumentParams.validation.validateOrThrow(this);
  }
}
