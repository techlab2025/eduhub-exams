import { describe, expect, it } from 'vitest';
import ShowAdviceParams from '../show.advice.params';

describe('ShowAdviceParams', () => {
  it('maps the advice id and requests all locales by default', () => {
    const params = new ShowAdviceParams({ adviceId: 3 });
    expect(params.toMap()).toEqual({ advice_id: 3 });
    expect(params.allLocales).toBe(true);
  });
});
