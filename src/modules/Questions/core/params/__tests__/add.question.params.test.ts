import { describe, expect, it } from 'vitest';
import AddquestionsParams from '../add.question.params';

describe('AddquestionsParams', () => {
  it('omits optional text and collection fields when they are absent', () => {
    const payload = new AddquestionsParams({}).toMap();

    expect(payload).not.toHaveProperty('question');
    expect(payload).not.toHaveProperty('answers');
    expect(payload).not.toHaveProperty('identicality_percentage');
  });
});
