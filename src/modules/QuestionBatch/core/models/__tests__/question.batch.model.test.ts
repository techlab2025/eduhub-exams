import { describe, expect, it } from 'vitest';
import QuestionBatchModel from '../question.batch.model';

describe('QuestionBatchModel', () => {
  it('maps the fetch_question_batches response', () => {
    const model = QuestionBatchModel.fromJson({
      id: 8,
      title: [
        { locale: 'ar', title: 'حزمة عربية' },
        { locale: 'en', title: 'Arabic Batch' },
      ],
      education_type: [{ id: 1, title: 'Governmental', children: [{ id: 2, title: 'Primary' }] }],
      e_c_subject: { id: 3, title: 'Arabic' },
      curriculum: { id: 1, title: 'Governmental' },
      number_of_questions: '10',
      'sources ': ['Book'],
      status: '2',
      created_by: { id: 99, name: 'Legacy creator' },
      created_at: { id: 7, name: 'Ahmed' },
      generation_date: '2026-08-23',
      can_delete: false,
    });
    expect(model).toMatchObject({
      id: 8,
      title: 'Arabic Batch',
      numberOfQuestions: 10,
      sources: ['Book'],
      status: '2',
      eCSubject: { id: 3, title: 'Arabic' },
      curriculum: { id: 1, title: 'Governmental' },
      generationDate: '2026-08-23',
      canDelete: false,
    });
    expect(model.educationType[0]?.children[0]).toMatchObject({ id: 2, title: 'Primary' });
    expect(model.createdAt).toMatchObject({ id: 7, name: 'Ahmed' });
    expect(model.subject).toBe(model.eCSubject);
    expect(model.createdBy).toBe(model.createdAt);
  });

  it('prevents deletion when the API reports used questions', () => {
    const model = QuestionBatchModel.fromJson({
      id: 9,
      status: '3',
      is_used_in_exam_or_exercise: true,
    });

    expect(model.canDelete).toBe(false);
  });

  it('allows deletion when no usage restriction is returned', () => {
    const model = QuestionBatchModel.fromJson({ id: 10, status: '1' });

    expect(model.canDelete).toBe(true);
  });
});
