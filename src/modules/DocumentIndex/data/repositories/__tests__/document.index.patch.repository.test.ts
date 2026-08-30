import { describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import CheckDocumentIndexStatusParams from '../../../core/params/check.document.index.status.params';
import GenerateDocumentIndexParams from '../../../core/params/generate.document.index.params';
import IndexDocumentIndexPatchParams from '../../../core/params/index.document.index.patch.params';
import DocumentIndexApiService from '../../api/document.index.api-service';
import DocumentIndexPatchRepository from '../document.index.patch.repository';

describe('DocumentIndexPatchRepository', () => {
  it('fetches and parses document index patch jobs', async () => {
    vi.spyOn(DocumentIndexApiService.getInstance(), 'index').mockResolvedValue({
      data: {
        status: true,
        data: [
          {
            id: 12,
            document_id: 17,
            employee: { name: 'Indexing Employee' },
            created_by: { name: 'Portal Admin' },
            created_at: '2026-08-26',
            status: 1,
            is_apply: false,
          },
        ],
      },
      statusCode: 200,
    });

    const result = await DocumentIndexPatchRepository.getInstance().index(
      new IndexDocumentIndexPatchParams(),
      { useStaticData: false },
    );

    expect(result).toBeInstanceOf(DataSuccess);
    expect(result.data?.[0]).toMatchObject({ id: 12, documentId: 17, status: 1 });
  });

  it('starts and checks a document index job', async () => {
    const service = DocumentIndexApiService.getInstance();
    vi.spyOn(service, 'createIndex').mockResolvedValue({
      data: { status: true, data: { transaction_id: 'TXN-012' } },
      statusCode: 201,
    });
    vi.spyOn(service, 'checkIndexStatus').mockResolvedValue({
      data: {
        status: true,
        data: {
          status: 2,
          is_apply: true,
          document_id: 17,
          generated_index: { book_id: 17, book_status: 'completed', chapters: [] },
        },
      },
      statusCode: 200,
    });

    const startResult = await DocumentIndexPatchRepository.getInstance().startIndex(
      new GenerateDocumentIndexParams(17),
      {
        useStaticData: false,
      },
    );
    expect(startResult).toBeInstanceOf(DataSuccess);
    expect(startResult.data).toBe(12);
    const checkResult = await DocumentIndexPatchRepository.getInstance().checkStatus(
      new CheckDocumentIndexStatusParams(12),
      { useStaticData: false },
    );
    expect(checkResult).toBeInstanceOf(DataSuccess);
    expect(checkResult.data).toMatchObject({ status: 2, isApply: true, documentId: 17 });
  });

  it('uses the document id when a successful start response has no transaction payload', async () => {
    vi.spyOn(DocumentIndexApiService.getInstance(), 'createIndex').mockResolvedValue({
      data: { status: true, message: 'Document indexing started.' },
      statusCode: 201,
    });

    const result = await DocumentIndexPatchRepository.getInstance().startIndex(
      new GenerateDocumentIndexParams(17),
      { useStaticData: false },
    );

    expect(result).toBeInstanceOf(DataSuccess);
    expect(result.data).toBe(17);
  });
});
