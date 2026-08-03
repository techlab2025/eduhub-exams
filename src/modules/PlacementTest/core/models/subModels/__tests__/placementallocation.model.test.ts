import { describe, expect, it } from 'vitest';
import PlacemntAllocationModel from '../placementallocation.model';

describe('PlacemntAllocationModel', () => {
  it('maps question times and difficulty totals from the API response', () => {
    const model = PlacemntAllocationModel.fromJson({
      id: 1,
      allTime: [
        { time: 15, difficulty_level: 3, correct_status: 0, question_number: 1 },
        { time: 32, difficulty_level: 2, correct_status: 1, question_number: 2 },
        { time: 46, difficulty_level: 1, correct_status: 1, question_number: 3 },
      ],
      total_questions: 3,
      easy: 20,
      totalnumber_easy: 20,
      medium: 55,
      totalnumber_medium: 60,
      hard: 10,
      totalnumber_hard: 20,
    });

    expect(model.allTime).toHaveLength(3);
    expect(model.allTime?.[0]).toMatchObject({
      time: 15,
      difficultyLevel: 3,
      correctStatus: 0,
      questionNumber: 1,
    });
    expect(model.totalQuestions).toBe(3);
    expect(model.Easy).toBe(20);
    expect(model.totalnumberEasy).toBe(20);
    expect(model.Medium).toBe(55);
    expect(model.totalnumberMedium).toBe(60);
    expect(model.Hard).toBe(10);
    expect(model.totalnumberHard).toBe(20);
  });
});
