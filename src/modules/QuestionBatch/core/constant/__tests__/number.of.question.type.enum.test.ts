import { describe, expect, it } from 'vitest';
import { NumberOfQuestionTypeEnum } from '../number.of.question.type.enum';

describe('NumberOfQuestionTypeEnum', () => {
  it('matches the API values', () => {
    expect(NumberOfQuestionTypeEnum).toEqual({ ANY_NUMBER: '1', SPECIFIC_NUMBER: '2' });
  });
});
