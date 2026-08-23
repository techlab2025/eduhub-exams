import { describe, expect, it } from 'vitest';
import GeneratedQuestionBatchModel from '../generated.question.batch.model';

describe('GeneratedQuestionBatchModel', () => {
  it('maps generated questions through ShowQuestionsModel', () => {
    const model = GeneratedQuestionBatchModel.fromJson({
      batch_id: 4,
      questions: [
        {
          question_id: 9,
          question_type: 1,
          difficulty_level: 3,
          question: 'What is a cell?',
          topics: [],
          answers: [],
          documents: [],
          explanation: {},
        },
      ],
    });
    expect(model.batchId).toBe(4);
    expect(model.questions[0]?.questionTitle).toBe('What is a cell?');
  });

  it('provides review-dialog static data', () => {
    expect(GeneratedQuestionBatchModel.example.questions).toHaveLength(2);
  });
});
