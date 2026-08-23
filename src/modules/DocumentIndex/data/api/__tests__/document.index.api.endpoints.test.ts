import { describe, expect, it } from 'vitest';
import { DocumentIndexEndpoints } from '../document.index.api.endpoints';

describe('DocumentIndexEndpoints', () => {
  it('uses the document_generate_index endpoint', () => {
    expect(new DocumentIndexEndpoints().generate).toContain('dashboard/document_generate_index');
  });
});
