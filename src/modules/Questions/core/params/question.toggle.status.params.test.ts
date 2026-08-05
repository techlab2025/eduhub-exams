import { describe, expect, it } from 'vitest';
import ToggleQuestionStatusParams from './question.toggle.status.params';
import { QuestionStatusEnum } from '../constant/question.status.enum';

describe('ToggleQuestionStatusParams', () => {
  it('maps an article status update to the review-status endpoint payload', () => {
    const params = new ToggleQuestionStatusParams({
      id: 437,
      status: QuestionStatusEnum.REJECTED,
    });

    expect(params.toMap()).toEqual({
      question_id: 437,
      status: 3,
    });
  });

  it('includes a note when one is provided', () => {
    const params = new ToggleQuestionStatusParams({
      id: 437,
      status: QuestionStatusEnum.REJECTED,
      note: 'Needs changes',
    });

    expect(params.toMap()).toEqual({
      question_id: 437,
      status: 3,
      note: 'Needs changes',
    });
  });
});
