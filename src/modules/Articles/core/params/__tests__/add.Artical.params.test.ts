import { describe, expect, it } from 'vitest';
import { QuestionStatusEnum } from '@/modules/Questions/core/constant/question.status.enum';
import AddArticlesParams from '../add.Artical.params';

describe('AddArticlesParams', () => {
  it('maps the selected review status to the API payload', () => {
    const params = new AddArticlesParams({
      question: 'Article title',
      status: QuestionStatusEnum.NOT_REVIEW,
    });

    expect(params.toMap()).toMatchObject({
      question: 'Article title',
      review_status: QuestionStatusEnum.NOT_REVIEW,
    });
  });
});
