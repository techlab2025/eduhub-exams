import { describe, expect, it } from 'vitest';
import AddPlacementParams from '../add.placement.params';

describe('AddPlacementParams', () => {
  it('maps placement percentages to the backend question-count fields', () => {
    const params = new AddPlacementParams({
      numberOfQuestions: 20,
      time: 30,
      difficulties: {
        easy: 25,
        medium: 50,
        hard: 25,
      },
    });

    expect(params.toMap()).toEqual({
      question_count: 20,
      easy_questions_count: 5,
      medium_questions_count: 10,
      hard_questions_count: 5,
      minute_count: 30,
    });
  });
});
