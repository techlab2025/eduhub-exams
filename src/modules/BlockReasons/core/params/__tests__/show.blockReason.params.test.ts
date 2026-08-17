import { describe, expect, it } from 'vitest';
import ShowBlockReasonsParams from '../show.blockReason.params';

describe('ShowBlockReasonsParams', () => {
  it('maps the id and retains the locale option', () => {
    const params = new ShowBlockReasonsParams({ blockReasonId: 3, allLocales: true });
    expect(params.toMap()).toEqual({ block_reason_id: 3 });
    expect(params.allLocales).toBe(true);
  });
});
