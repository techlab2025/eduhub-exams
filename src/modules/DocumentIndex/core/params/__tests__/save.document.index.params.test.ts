import { describe, expect, it } from 'vitest';
import SaveDocumentIndexParams from '../save.document.index.params';

describe('SaveDocumentIndexParams', () => {
  it('maps the document id', () => {
    expect(new SaveDocumentIndexParams(17).toMap()).toEqual({ document_id: 17 });
  });
});
