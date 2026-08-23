import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { NumberOfQuestionTypeEnum } from '../constant/number.of.question.type.enum';
import type { QuestionBatchDifficultyEnum } from '../constant/question.batch.difficulty.enum';
import type { QuestionBatchStatusEnum } from '../constant/question.batch.status.enum';
import type { QuestionBatchTypeEnum } from '../constant/question.batch.type.enum';

export default class StoreQuestionBatchParams implements Params {
  public readonly educationClassificationId: number;
  public readonly eCSubjectId: number;
  public readonly documentId: number;
  public readonly status: QuestionBatchStatusEnum;
  public readonly numberOfQuestionsType: NumberOfQuestionTypeEnum;
  public readonly numberOfQuestions: number;
  public readonly questionType: QuestionBatchTypeEnum;
  public readonly questionDifficulty: QuestionBatchDifficultyEnum;

  public static readonly validation = new ClassValidation().setRules({
    educationClassificationId: { required: true, min: 1 },
    eCSubjectId: { required: true, min: 1 },
    documentId: { required: true, min: 1 },
    status: { required: true },
    numberOfQuestionsType: { required: true },
    numberOfQuestions: { required: true, min: 0 },
    questionType: { required: true },
    questionDifficulty: { required: true },
  });

  constructor(data: {
    educationClassificationId: number;
    eCSubjectId: number;
    documentId: number;
    status: QuestionBatchStatusEnum;
    numberOfQuestionsType: NumberOfQuestionTypeEnum;
    numberOfQuestions: number;
    questionType: QuestionBatchTypeEnum;
    questionDifficulty: QuestionBatchDifficultyEnum;
  }) {
    this.educationClassificationId = data.educationClassificationId;
    this.eCSubjectId = data.eCSubjectId;
    this.documentId = data.documentId;
    this.status = data.status;
    this.numberOfQuestionsType = data.numberOfQuestionsType;
    this.numberOfQuestions = data.numberOfQuestions;
    this.questionType = data.questionType;
    this.questionDifficulty = data.questionDifficulty;
  }

  toMap(): Record<string, string | number> {
    return {
      education_classification_id: this.educationClassificationId,
      e_c_subject_id: this.eCSubjectId,
      document_id: this.documentId,
      status: this.status,
      number_of_questions_type: this.numberOfQuestionsType,
      number_of_questions: this.numberOfQuestions,
      question_type: this.questionType,
      question_difficulty: this.questionDifficulty,
    };
  }

  validate() {
    return StoreQuestionBatchParams.validation.validate(this);
  }

  validateOrThrow() {
    return StoreQuestionBatchParams.validation.validateOrThrow(this);
  }
}
