import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { ArticleQuestionTypeEnum } from '../constant/Article.question.type.enum';
import type TitleInterface from '@/base/Data/Models/titleInterface';
import type AttachmentsParams from '@/modules/Questions/core/params/subParams/attachments.params';
import type { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';

/**
 * Parameters for adding a new employee
 */
export default class AddArticlesParams implements Params {
  public question_description?: string;
  public attachments?: AttachmentsParams[];
  public question?: string;
  public question_type?: ArticleQuestionTypeEnum;
  public e_c_subject_id?: number;
  public status?: QuestionStatusEnum | null;
  public documents?: TitleInterface<string>;
  public explanation?: {
    explanation?: string;
    attachments?: AttachmentsParams[];
  };

  public static readonly validation = new ClassValidation().setRules({
    question_type: { required: true },
    question: { required: true, minLength: 5 },
    documents: { required: true },
  });

  constructor(data: {
    question_description?: string;
    attachments?: AttachmentsParams[];
    question?: string;
    question_type?: ArticleQuestionTypeEnum;
    e_c_subject_id?: number;
    status?: QuestionStatusEnum | null;
    documents?: TitleInterface<string>;
    explanation?: {
      explanation?: string;
      attachments?: AttachmentsParams[];
    };
  }) {
    this.question_description = data.question_description;
    this.attachments = data.attachments;
    this.question = data.question;
    this.question_type = data.question_type;
    this.e_c_subject_id = data.e_c_subject_id;
    this.status = data.status;
    this.documents = data.documents;
    this.explanation = data.explanation;
  }

  toMap(): { [p: string]: any } {
    return {
      question_description: this.question_description,
      attachments: this.attachments?.map((f) => f.toMap()),
      question: this.question,
      question_type: this.question_type,
      e_c_subject_id: this.e_c_subject_id,
      ...(this.status != null && { review_status: this.status }),
      documents: [this.documents],
      ...(this.explanation?.explanation && {
        explanation: this.explanation,
      }),
      difficulty_level: 1,
    };
  }

  validate() {
    return AddArticlesParams.validation.validate(this);
  }

  validateOrThrow() {
    return AddArticlesParams.validation.validateOrThrow(this);
  }
}
