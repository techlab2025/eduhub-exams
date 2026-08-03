import { describe, expect, it } from 'vitest';
import ShowPlcaementTestModel from '../show.placement.test.model';
import PlacemntAllocationModel from '../subModels/placementallocation.model';

describe('ShowPlcaementTestModel', () => {
  it('maps allocation data for the question time chart', () => {
    const model = ShowPlcaementTestModel.fromJson({
      id: 7,
      result_analysis: {},
      time_analysis: {},
      allocation: {
        id: 1,
        allTime: [
          { time: 15, difficulty_level: 3, correct_status: 0, question_number: 1 },
          { time: 32, difficulty_level: 2, correct_status: 1, question_number: 2 },
        ],
        total_questions: 2,
        easy: 1,
        totalnumber_easy: 1,
        medium: 1,
        totalnumber_medium: 1,
        hard: 0,
        totalnumber_hard: 0,
      },
    });

    expect(model.id).toBe(7);
    expect(model.allocation).toBeInstanceOf(PlacemntAllocationModel);
    expect(model.allocation?.allTime?.map((item) => item.time)).toEqual([15, 32]);
  });

  it('provides complete example data for every analysis tab', () => {
    const example = ShowPlcaementTestModel.example;

    expect(example.SkillsAnalysis).toHaveLength(6);
    expect(example.MostImportantSkillsAnalysis).toHaveLength(3);
    expect(example.NeedDevelopSkillsAnalysis).toHaveLength(3);
    expect(example.quesions).toHaveLength(3);
    expect(example.quesions?.[0]?.topics).toHaveLength(5);
    expect(example.quesions?.[0]?.topics?.map((topic) => topic.subtitle)).toEqual([1, 3, 2, 3, 1]);
  });
});
