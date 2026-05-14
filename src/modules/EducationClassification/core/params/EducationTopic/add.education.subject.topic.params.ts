import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

export default class AddEducationSubjectTopicParams implements Params {
  public id: number;
  public titles: TranslationParams;

  public static readonly validation = new ClassValidation().setRules({});

  constructor(data: { id: number; titles: TranslationParams }) {
    this.id = data.id;
    this.titles = data.titles;
  }

  toMap(): { [p: string]: any } {
    return {
      education_classification_subject_id: this.id,
      titles: this.titles,
    };
  }

  validate() {
    return AddEducationSubjectTopicParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddEducationSubjectTopicParams.validation.validateOrThrow(this);
  }
}
