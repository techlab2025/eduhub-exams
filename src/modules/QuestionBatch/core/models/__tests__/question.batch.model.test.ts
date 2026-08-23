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
      education_type: [{ id: 1, title: 'Governmental', children: [] }],
      e_c_subject: { id: 3, title: 'Arabic' },
      curriculum: { id: 1, title: 'Governmental' },
      number_of_questions: '10',
      'sources ': ['Book'],
      status: '2',
      created_at: { id: 7, name: 'Ahmed' },
      generation_date: '2026-08-23',
    });
    expect(model).toMatchObject({
      id: 8,
      title: 'Arabic Batch',
      numberOfQuestions: 10,
      sources: ['Book'],
      status: '2',
    });
    expect(model.createdBy.name).toBe('Ahmed');
  });
});
