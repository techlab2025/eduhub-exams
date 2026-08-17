import { describe, expect, it } from 'vitest';
import IndexBlockReasonsParams from '../index.blockReason.params';

describe('IndexBlockReasonsParams', () => {
  it('maps search and pagination', () => {
    expect(
      new IndexBlockReasonsParams({ word: 'policy', pageNumber: 2, perPage: 20 }).toMap(),
    ).toMatchObject({ word: 'policy', page_number: 2, per_page: 20 });
  });
});
