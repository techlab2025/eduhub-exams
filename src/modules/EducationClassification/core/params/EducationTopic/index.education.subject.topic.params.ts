import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class IndexEducationSubjectTopicParams implements Params {
  public TopicId: number;

  public static readonly validation = new ClassValidation().setRules({});

  constructor(data: { TopicId: number }) {
    this.TopicId = data.TopicId;
  }

  toMap(): { [p: string]: any } {
    return {
      education_classification_subject_topic_id: this.TopicId,
    };
  }

  validate() {
    return IndexEducationSubjectTopicParams.validation.validate(this);
  }

  validateOrThrow() {
    return IndexEducationSubjectTopicParams.validation.validateOrThrow(this);
  }
}
