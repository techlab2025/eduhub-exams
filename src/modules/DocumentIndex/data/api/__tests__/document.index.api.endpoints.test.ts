import { describe, expect, it } from 'vitest';
import { DocumentIndexEndpoints } from '../document.index.api.endpoints';

describe('DocumentIndexEndpoints', () => {
  it('uses the documented create, update and save endpoints', () => {
    const endpoints = new DocumentIndexEndpoints();
    expect(endpoints.createIndex).toContain('dashboard/create_document_index');
    expect(endpoints.updateIndex).toContain('dashboard/update_document_index');
    expect(endpoints.saveIndex).toContain('dashboard/save_document_index');
  });
});
