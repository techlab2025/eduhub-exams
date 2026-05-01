import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type DocumentTranslationParams from './translation.params';

export default class AddDocumentParams implements Params {
  public title: string;
  public refNumber: string;
  public documentTypeId: number;
  public subjects: number[];
  public translations: DocumentTranslationParams;
  public tags: string[];
  public images: string[];
  public files: string[];

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 255 },
  });

  constructor(data: {
    title: string;
    refNumber: string;
    documentTypeId: number;
    subjects: number[];
    translations: DocumentTranslationParams;
    tags: string[];
    images: string[];
    files: string[];
  }) {
    this.title = data.title;
    this.refNumber = data.refNumber;
    this.documentTypeId = data.documentTypeId;
    this.subjects = data.subjects;
    this.translations = data.translations;
    this.tags = data.tags;
    this.images = data.images;
    this.files = data.files;
  }

  toMap(): { [p: string]: any } {
    return {
      title: this.title,
      refrance_number: this.refNumber,
      document_type_id: this.documentTypeId,
      subjects: this.subjects,
      translations: this.translations,
      tags: this.tags,
      images: this.images,
      files: this.files,
    };
  }

  validate() {
    return AddDocumentParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddDocumentParams.validation.validateOrThrow(this);
  }
}
