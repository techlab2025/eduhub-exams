import { describe, expect, it } from 'vitest';
import RefreshDocumentIndexStatusParams from '../refresh.document.index.status.params';

describe('RefreshDocumentIndexStatusParams', () => {
  it('maps the patch identifier', () => {
    expect(new RefreshDocumentIndexStatusParams(12).toMap()).toEqual({ id: 12 });
  });
});
