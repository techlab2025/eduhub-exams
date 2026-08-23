import { describe, expect, it, vi } from 'vitest';
import {
  DataCancelled,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GenerateDocumentIndexParams from '../../../core/params/generate.document.index.params';
import DocumentIndexApiService from '../../api/document.index.api-service';
import DocumentIndexRepository from '../document.index.repository';

describe('DocumentIndexRepository', () => {
  it('parses generated index rows from the API response', async () => {
    vi.spyOn(DocumentIndexApiService.getInstance(), 'generateIndex').mockResolvedValue({
      data: {
        status: true,
        data: [
          {
            level: 'Chapter',
            title: 'Language Skills',
            from_pdf: 3,
            to_pdf: 34,
            printed_page_label: '3-30',
          },
        ],
      },
      statusCode: 200,
    });

    const result = await DocumentIndexRepository.getInstance().generateIndex(
      new GenerateDocumentIndexParams(17),
      { useStaticData: false },
    );

    expect(result).toBeInstanceOf(DataSuccess);
    expect(result.data?.items[0]).toMatchObject({
      level: 'Chapter',
      fromPdf: 3,
      toPdf: 34,
    });
  });

  it('cancels the delayed static response when its signal is aborted', async () => {
    const requestController = new AbortController();
    const resultPromise = DocumentIndexRepository.getInstance().generateIndex(
      new GenerateDocumentIndexParams(17),
      { useStaticData: true, signal: requestController.signal },
    );

    requestController.abort();

    await expect(resultPromise).resolves.toBeInstanceOf(DataCancelled);
  });
});
