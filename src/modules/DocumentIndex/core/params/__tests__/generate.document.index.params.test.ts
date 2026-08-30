import { describe, expect, it } from 'vitest';
import GenerateDocumentIndexParams from '../generate.document.index.params';

describe('GenerateDocumentIndexParams', () => {
  it('maps the selected document id', () => {
    const params = new GenerateDocumentIndexParams(17);

    expect(params.toMap()).toEqual({ document_id: 17, auto_generate: false });
    expect(params.validate().isValid).toBe(true);
  });
});
