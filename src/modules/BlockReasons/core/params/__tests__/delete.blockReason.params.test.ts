import { describe, expect, it } from 'vitest';
import DeleteBlockReasonsParams from '../delete.blockReason.params';

describe('DeleteBlockReasonsParams', () => {
  it('maps the block reason id', () => {
    expect(new DeleteBlockReasonsParams({ blockReasonId: 4 }).toMap()).toEqual({
      block_reason_id: 4,
    });
  });
});
