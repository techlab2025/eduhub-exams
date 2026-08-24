import { describe, expect, it } from 'vitest';
import DeleteAdviceParams from '../delete.advice.params';

describe('DeleteAdviceParams', () => {
  it('maps the advice id', () => {
    expect(new DeleteAdviceParams({ adviceId: 4 }).toMap()).toEqual({ advice_id: 4 });
  });
});
