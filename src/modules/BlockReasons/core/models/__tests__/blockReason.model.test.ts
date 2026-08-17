import { describe, expect, it } from 'vitest';
import BlockReasonModel from '../blockReason.model';
describe('BlockReasonModel', () => {
  it('maps block reason responses', () => {
    expect(
      BlockReasonModel.fromJson({ block_reason_id: 4, title: 'Policy violation' }),
    ).toMatchObject({ id: 4, title: 'Policy violation' });
  });
});
