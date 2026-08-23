import { describe, expect, it } from 'vitest';
import { NumberOfQuestionTypeEnum } from '../../constant/number.of.question.type.enum';
import { QuestionBatchDifficultyEnum } from '../../constant/question.batch.difficulty.enum';
import { QuestionBatchStatusEnum } from '../../constant/question.batch.status.enum';
import { QuestionBatchTypeEnum } from '../../constant/question.batch.type.enum';
import StoreQuestionBatchParams from '../store.question.batch.params';

describe('StoreQuestionBatchParams', () => {
  it('maps the exact store_question_batch contract', () => {
    const map = new StoreQuestionBatchParams({
      educationClassificationId: 12,
      eCSubjectId: 284,
      documentId: 7,
      status: QuestionBatchStatusEnum.DRAFT,
      numberOfQuestionsType: NumberOfQuestionTypeEnum.SPECIFIC_NUMBER,
      numberOfQuestions: 10,
      questionType: QuestionBatchTypeEnum.MCQ,
      questionDifficulty: QuestionBatchDifficultyEnum.HARD,
    }).toMap();
    expect(map).toEqual({
      education_classification_id: 12,
      e_c_subject_id: 284,
      document_id: 7,
      status: '1',
      number_of_questions_type: '2',
      number_of_questions: 10,
      question_type: '2',
      question_difficulty: '4',
    });
  });
});
