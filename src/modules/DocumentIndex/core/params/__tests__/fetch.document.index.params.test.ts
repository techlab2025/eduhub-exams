import { describe, expect, it } from 'vitest';
import FetchDocumentIndexParams from '../fetch.document.index.params';

describe('FetchDocumentIndexParams', () => {
  it('maps only the transaction id', () => {
    expect(new FetchDocumentIndexParams('TXN-012').toMap()).toEqual({
      transaction_id: 'TXN-012',
    });
  });
});
