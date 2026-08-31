import { describe, expect, it, vi } from 'vitest';
import GenerateDocumentIndexParams from '../../../core/params/generate.document.index.params';
import RefreshDocumentIndexStatusParams from '../../../core/params/refresh.document.index.status.params';
import DocumentIndexApiService from '../document.index.api-service';

describe('DocumentIndexApiService', () => {
  it('posts create, update and save params to their custom endpoints', async () => {
    const service = DocumentIndexApiService.getInstance();
    const customPost = vi.spyOn(service, 'customPost').mockResolvedValue({
      data: { data: [] },
      statusCode: 200,
    });
    const params = new GenerateDocumentIndexParams(17);
    const refreshParams = new RefreshDocumentIndexStatusParams('TXN-012');
    const signal = new AbortController().signal;

    await service.createIndex(params, { signal, timeout: 0 });
    await service.refreshIndexStatus(refreshParams);
    await service.updateIndex(params);
    await service.saveIndex(params);

    expect(customPost).toHaveBeenCalledWith(
      expect.stringContaining('start_document_index'),
      params,
      { signal, timeout: 0 },
    );
    expect(customPost).toHaveBeenCalledWith(
      expect.stringContaining('refresh_document_index_status'),
      refreshParams,
      undefined,
    );
    expect(customPost).toHaveBeenCalledWith(
      expect.stringContaining('update_document_index'),
      params,
      undefined,
    );
    expect(customPost).toHaveBeenCalledWith(
      expect.stringContaining('fetch_document_index'),
      params,
      undefined,
    );
  });
});
