import { describe, expect, it } from 'vitest';
import EditPlacementParams from '../edit.placement.params';

describe('EditPlacementParams', () => {
  it('maps placement percentages to the backend question-count fields', () => {
    const params = new EditPlacementParams({
      id: 7,
      numberOfQuestions: 40,
      time: 60,
      difficulties: {
        easy: 20,
        medium: 50,
        hard: 30,
      },
    });

    expect(params.toMap()).toEqual({
      id: 7,
      question_count: 40,
      easy_questions_count: 8,
      medium_questions_count: 20,
      hard_questions_count: 12,
      minute_count: 60,
    });
  });
});
