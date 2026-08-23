import { describe, expect, it, vi } from 'vitest';
import GenerateDocumentIndexParams from '../../../core/params/generate.document.index.params';
import DocumentIndexApiService from '../document.index.api-service';

describe('DocumentIndexApiService', () => {
  it('posts the generation params and cancellation options to the custom endpoint', async () => {
    const service = DocumentIndexApiService.getInstance();
    const customPost = vi.spyOn(service, 'customPost').mockResolvedValue({
      data: { data: [] },
      statusCode: 200,
    });
    const params = new GenerateDocumentIndexParams(17);
    const signal = new AbortController().signal;

    await service.generateIndex(params, { signal, timeout: 0 });

    expect(customPost).toHaveBeenCalledWith(
      expect.stringContaining('document_generate_index'),
      params,
      { signal, timeout: 0 },
    );
  });
});
