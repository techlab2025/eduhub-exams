import { describe, expect, it } from 'vitest';
import { DocumentIndexEndpoints } from '../document.index.api.endpoints';

describe('DocumentIndexEndpoints', () => {
  it('uses the documented patch workflow, update and save endpoints', () => {
    const endpoints = new DocumentIndexEndpoints();
    expect(endpoints.indexPatches).toContain('dashboard/fetch_document_transactions');
    expect(endpoints.createIndex).toContain('dashboard/start_document_index');
    expect(endpoints.refreshIndexStatus).toContain('dashboard/refresh_document_index_status');
    expect(endpoints.updateIndex).toContain('dashboard/update_document_index');
    expect(endpoints.fetchIndex).toContain('dashboard/fetch_document_index');
    expect(endpoints.saveIndex).toContain('dashboard/save_document_index');
  });
});
