import { describe, expect, it } from 'vitest';
import IndexDocumentIndexPatchParams from '../index.document.index.patch.params';

describe('IndexDocumentIndexPatchParams', () => {
  it('maps list pagination', () => {
    expect(new IndexDocumentIndexPatchParams(2, 25).toMap()).toEqual({
      with_pagination: 1,
      page: 2,
      per_page: 25,
    });
  });

  it('maps the transaction-history search term', () => {
    expect(new IndexDocumentIndexPatchParams(1, 10, 1, 'TXN-002').toMap()).toMatchObject({
      word: 'TXN-002',
    });
  });
});
