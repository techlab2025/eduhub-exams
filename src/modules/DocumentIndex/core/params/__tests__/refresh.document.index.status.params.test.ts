import { describe, expect, it } from 'vitest';
import RefreshDocumentIndexStatusParams from '../refresh.document.index.status.params';

describe('RefreshDocumentIndexStatusParams', () => {
  it('maps the transaction identifier', () => {
    expect(new RefreshDocumentIndexStatusParams('TXN-012').toMap()).toEqual({
      transaction_id: 'TXN-012',
    });
  });
});
