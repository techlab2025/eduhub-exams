import { describe, expect, it, vi } from 'vitest';
import {
  DataCancelled,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import { NumberOfQuestionTypeEnum } from '../../../core/constant/number.of.question.type.enum';
import { QuestionBatchDifficultyEnum } from '../../../core/constant/question.batch.difficulty.enum';
import { QuestionBatchStatusEnum } from '../../../core/constant/question.batch.status.enum';
import { QuestionBatchTypeEnum } from '../../../core/constant/question.batch.type.enum';
import StoreQuestionBatchParams from '../../../core/params/store.question.batch.params';
import ShowQuestionBatchParams from '../../../core/params/show.question.batch.params';
import QuestionBatchApiService from '../../api/question.batch.api-service';
import QuestionBatchRepository from '../question.batch.repository';

const params = new StoreQuestionBatchParams({
  educationClassificationId: 1,
  eCSubjectId: 2,
  documentId: 3,
  status: QuestionBatchStatusEnum.DRAFT,
  numberOfQuestionsType: NumberOfQuestionTypeEnum.ANY_NUMBER,
  numberOfQuestions: 10,
  questionType: [QuestionBatchTypeEnum.MCQ],
  questionDifficulty: [QuestionBatchDifficultyEnum.HARD],
});

describe('QuestionBatchRepository', () => {
  it('parses the approved batch returned by show_question_batch', async () => {
    const params = new ShowQuestionBatchParams(4);
    const show = vi.spyOn(QuestionBatchApiService.getInstance(), 'show').mockResolvedValue({
      statusCode: 200,
      data: {
        status: true,
        data: {
          batch_id: 4,
          questions: [
            {
              question_id: 9,
              question: 'What is a cell?',
              topics: [],
              answers: [],
              documents: [],
              explanation: {},
            },
          ],
        },
      },
    });

    const result = await QuestionBatchRepository.getInstance().show(params, {
      useStaticData: false,
    });

    expect(show).toHaveBeenCalledWith(params, { useStaticData: false }, undefined);
    expect(result).toBeInstanceOf(DataSuccess);
    expect(result.data?.batchId).toBe(4);
    expect(result.data?.questions[0]?.questionTitle).toBe('What is a cell?');
  });

  it('parses generated ShowQuestionsModel rows', async () => {
    vi.spyOn(QuestionBatchApiService.getInstance(), 'generateBatch').mockResolvedValue({
      statusCode: 200,
      data: {
        status: true,
        data: {
          batch_id: 4,
          questions: [
            {
              question_id: 9,
              question: 'What is a cell?',
              topics: [],
              answers: [],
              documents: [],
              explanation: {},
            },
          ],
        },
      },
    });
    const result = await QuestionBatchRepository.getInstance().generateBatch(params, {
      useStaticData: false,
    });
    expect(result).toBeInstanceOf(DataSuccess);
    expect(result.data?.questions[0]?.questionTitle).toBe('What is a cell?');
  });

  it('supports cancelling static generation', async () => {
    const request = new AbortController();
    const promise = QuestionBatchRepository.getInstance().generateBatch(params, {
      useStaticData: true,
      signal: request.signal,
    });
    request.abort();
    await expect(promise).resolves.toBeInstanceOf(DataCancelled);
  });
});
