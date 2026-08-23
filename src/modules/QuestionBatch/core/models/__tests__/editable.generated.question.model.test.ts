import { describe, expect, it } from 'vitest';
import GeneratedQuestionBatchModel from '../generated.question.batch.model';
import EditableGeneratedQuestionModel from '../editable.generated.question.model';

describe('EditableGeneratedQuestionModel', () => {
  it('creates an editable draft and returns a new immutable question', () => {
    const original = GeneratedQuestionBatchModel.example.questions[0];
    if (!original) throw new Error('Expected static generated question');
    const draft = EditableGeneratedQuestionModel.fromQuestion(original);
    draft.title = 'Updated question';
    const firstAnswer = draft.answers[0];
    if (!firstAnswer) throw new Error('Expected static generated answer');
    firstAnswer.answer = 'Updated answer';
    draft.explanation = 'Updated explanation';

    const updated = draft.toQuestion(original);

    expect(updated).not.toBe(original);
    expect(updated.questionTitle).toBe('Updated question');
    expect(updated.answers?.[0]?.answer).toBe('Updated answer');
    expect(updated.explanation?.explanation).toBe('Updated explanation');
    expect(Object.isFrozen(updated)).toBe(true);
  });
});
