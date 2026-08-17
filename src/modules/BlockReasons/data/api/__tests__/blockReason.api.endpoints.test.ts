import { describe, expect, it } from 'vitest';
import { BlockReasonEndpoints } from '../blockReason.api.endpoints';
describe('BlockReasonEndpoints', () => {
  it('registers every CRUD endpoint', () => {
    const value = new BlockReasonEndpoints();
    expect([value.index, value.store, value.show, value.update, value.delete]).toEqual(
      expect.arrayContaining([
        expect.stringContaining('fetch_block_reasons'),
        expect.stringContaining('store_block_reason'),
        expect.stringContaining('show_block_reason'),
        expect.stringContaining('update_block_reason'),
        expect.stringContaining('delete_block_reason'),
      ]),
    );
  });
});
