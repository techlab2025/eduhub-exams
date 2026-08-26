import { describe, expect, it } from 'vitest';
import CheckDocumentIndexStatusParams from '../check.document.index.status.params';

describe('CheckDocumentIndexStatusParams', () => {
  it('maps the patch identifier', () => {
    expect(new CheckDocumentIndexStatusParams(12).toMap()).toEqual({ id: 12 });
  });
});
