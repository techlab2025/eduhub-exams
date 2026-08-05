import { describe, expect, it } from 'vitest';
import ShowPlcaementTestModel from '../show.placement.test.model';
import PlacemntAllocationModel from '../subModels/placementallocation.model';

describe('ShowPlcaementTestModel', () => {
  it('maps the current placement test show response', () => {
    const model = ShowPlcaementTestModel.fromJson({
      id: 1,
      exam_id: 1,
      student: { id: 7, name: '7omsa', image: '' },
      result: null,
      e_c_subject: {
        id: 284,
        title: 'mostafa 2',
        full_title: 'mostafa 1 -> mostafa 2',
        children: [],
      },
      e_c_branch: { id: 361, title: 'mostafa 1', full_title: 'mostafa 1' },
      number_of_questions: 1,
      status: 'pending',
      in_plan: false,
      date: '2026-08-05',
      questions: [
        {
          question_id: 363,
          question: 'zzzzzz',
          question_description: '',
          question_type: 1,
          correct_status: 1,
          difficulty_level: 1,
          e_c_subject: { e_c_subject_id: 284, title: 'mostafa 2' },
          e_c_branch: {
            e_c_branch_id: 361,
            title: 'mostafa 1',
            full_title: 'mostafa 1',
          },
          created_by: { id: 1, name: 'Admin EG' },
          created_at: '2026-07-29',
          answers: [
            { answer_id: 1745, answer: 'aa', is_correct: true, attachments: [] },
            { answer_id: 1746, answer: 'bb', is_correct: false, attachments: [] },
          ],
          attachments: [],
          explanation: {},
          topics: [{ e_c_s_topic_id: 42, title: 'Topic 1' }],
          skills: [{ skill_id: 76, title: 'lkk', percentage: '34' }],
          answer_hint: {},
          answer_step: {},
          documents: [{ document_id: 70, document_title: 'Document', text: '333' }],
        },
      ],
      result_analysis: {
        correct: 0,
        wrong: 1,
        skipped: 0,
        total_rate: 'good',
        percentage: 0,
      },
      time_analysis: {
        start_time: '2026-08-05 07:14:45',
        end_time: null,
        actual_duration: null,
        time_passed: 0,
      },
      question_answer_analysis: [
        { question: { id: 363, question: 'zzzzzz' }, question_answer_duration: 0 },
      ],
      questions_answered_difficulty_level: [{ difficulty_level: 1, mark: 0 }],
      skills_analysis: [{ skill: { id: 76, title: 'lkk' }, percentage: 0 }],
      most_important_skills_analysis: [{ skill: { id: 76, title: 'lkk' }, percentage: 0 }],
      need_develop_skills_analysis: [{ skill: { id: 76, title: 'lkk' }, percentage: 0 }],
    });

    expect(model.student?.name).toBe('7omsa');
    expect(model.createdAt).toBe('2026-08-05');
    expect(model.resultAnalysis?.Skipped).toBe(0);
    expect(model.resultAnalysis?.precentage).toBe(0);
    expect(model.SkillsAnalysis?.[0].skill?.title).toBe('lkk');
    expect(model.SkillsAnalysis?.[0].precentage).toBe(0);
    expect(model.questionAnswerAnalysis?.[0].question?.id).toBe(363);
    expect(model.quesions).toHaveLength(1);
    expect(model.quesions?.[0].question_id).toBe(363);
    expect(model.quesions?.[0].answers).toHaveLength(2);
    expect(model.allocation?.allTime).toHaveLength(1);
    expect(model.allocation?.allTime?.[0].questionNumber).toBe(1);
    expect(model.allocation?.totalnumberEasy).toBe(1);
  });

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
    expect(example.quesions).toHaveLength(4);
    expect(example.quesions?.[0]?.topics).toHaveLength(5);
    expect(example.quesions?.[0]?.topics?.map((topic) => topic.subtitle)).toEqual([1, 3, 2, 3, 1]);
    expect(example.quesions?.[0]?.answers).toHaveLength(4);
    expect(example.quesions?.[0]?.questionLogHistory).toHaveLength(4);
    expect(example.quesions?.[3]?.questions).toHaveLength(3);
  });
});
