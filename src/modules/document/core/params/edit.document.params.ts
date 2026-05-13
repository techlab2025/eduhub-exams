import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type DocumentTranslationParams from './translation.params';

export default class EditDocumentParams implements Params {
  public document_id: number;
  public refNumber: string;
  public documentTypeId: number;
  public subjects: number;
  public stage_id: number;
  public translations: DocumentTranslationParams;
  public tags: string[];
  public images: string[];
  public files: string[];

  public static readonly validation = new ClassValidation().setRules({
    document_id: { required: true },
    translations: { required: true },
  });

  constructor(data: {
    document_id: number;
    refNumber: string;
    documentTypeId: number;
    stage_id: number;
    subjects: number;
    translations: DocumentTranslationParams;
    tags: string[];
    images: string[];
    files: string[];
  }) {
    this.document_id = data.document_id;
    this.refNumber = data.refNumber;
    this.documentTypeId = data.documentTypeId;
    this.stage_id = data.stage_id;
    this.subjects = data.subjects;
    this.translations = data.translations;
    this.tags = data.tags;
    this.images = data.images;
    this.files = data.files;
  }

  toMap(): { [p: string]: any } {
    return {
      document_id: this.document_id,
      reference_number: this.refNumber,
      document_type_id: this.documentTypeId,
      stage_id: this.stage_id,
      subject_id: this.subjects,
      translations: this.translations.toMap(),
      tags: this.tags,
      images: this.images,
      files: this.files,
    };
  }

  validate() {
    return EditDocumentParams.validation.validate(this);
  }

  validateOrThrow() {
    return EditDocumentParams.validation.validateOrThrow(this);
  }
}
