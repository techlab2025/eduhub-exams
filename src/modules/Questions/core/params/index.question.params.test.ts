import { describe, expect, it } from 'vitest';
import { QuestionStatusEnum } from '../constant/question.status.enum';
import { QuestionTypeEnum } from '../constant/question.type.enum';
import IndexQuestionsParams from './index.question.params';

describe('IndexQuestionsParams', () => {
  it('maps question filters to API query parameters', () => {
    const params = new IndexQuestionsParams({
      word: '',
      pageNumber: 1,
      perPage: 10,
      withPage: 1,
      status: QuestionStatusEnum.APPROVED,
      question_type: QuestionTypeEnum.matching,
      from_date: '2026-07-01',
      to_date: '2026-07-28',
    });

    expect(params.toMap()).toMatchObject({
      review_status: QuestionStatusEnum.APPROVED,
      question_type: QuestionTypeEnum.matching,
      from_date: '2026-07-01',
      to_date: '2026-07-28',
    });
  });

  it('omits empty optional filters', () => {
    const params = new IndexQuestionsParams({
      word: '',
      pageNumber: 1,
      perPage: 10,
      withPage: 1,
    });

    expect(params.toMap()).not.toHaveProperty('question_type');
    expect(params.toMap()).not.toHaveProperty('from_date');
    expect(params.toMap()).not.toHaveProperty('to_date');
  });

  it('maps multiple question types for server-side pagination filtering', () => {
    const questionTypes = [QuestionTypeEnum.mcq, QuestionTypeEnum.matching];
    const params = new IndexQuestionsParams({
      word: '',
      pageNumber: 1,
      perPage: 10,
      withPage: 1,
      question_type: questionTypes,
    });

    expect(params.toMap()).toMatchObject({ question_type: questionTypes });
  });
});
