import { describe, expect, it } from 'vitest';
import { QuestionStatusEnum } from '../../constant/question.status.enum';
import EditquestionsParams from '../edit.question.params';

describe('EditquestionsParams', () => {
  it('maps the selected review status for the update endpoint', () => {
    const params = new EditquestionsParams({
      id: 7,
      status: QuestionStatusEnum.DRAFT,
    });

    expect(params.toMap()).toMatchObject({
      question_id: 7,
      review_status: QuestionStatusEnum.DRAFT,
    });
  });
});
