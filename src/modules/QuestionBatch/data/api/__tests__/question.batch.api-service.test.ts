import { describe, expect, it, vi } from 'vitest';
import { NumberOfQuestionTypeEnum } from '../../../core/constant/number.of.question.type.enum';
import { QuestionBatchDifficultyEnum } from '../../../core/constant/question.batch.difficulty.enum';
import { QuestionBatchStatusEnum } from '../../../core/constant/question.batch.status.enum';
import { QuestionBatchTypeEnum } from '../../../core/constant/question.batch.type.enum';
import StoreQuestionBatchParams from '../../../core/params/store.question.batch.params';
import QuestionBatchApiService from '../question.batch.api-service';

describe('QuestionBatchApiService', () => {
  it('posts generation params with long-request options', async () => {
    const service = QuestionBatchApiService.getInstance();
    const customPost = vi.spyOn(service, 'customPost').mockResolvedValue({
      data: { data: [] },
      statusCode: 200,
    });
    const params = new StoreQuestionBatchParams({
      educationClassificationId: 1,
      eCSubjectId: 2,
      documentId: 3,
      status: QuestionBatchStatusEnum.DRAFT,
      numberOfQuestionsType: NumberOfQuestionTypeEnum.ANY_NUMBER,
      numberOfQuestions: 10,
      questionType: QuestionBatchTypeEnum.ANY_TYPE,
      questionDifficulty: QuestionBatchDifficultyEnum.ANY_DIFFICULTY,
    });
    const signal = new AbortController().signal;

    await service.generateBatch(params, { signal, timeout: 0 });
    expect(customPost).toHaveBeenCalledWith(
      expect.stringContaining('store_question_batch'),
      params,
      { signal, timeout: 0 },
    );
  });
});
