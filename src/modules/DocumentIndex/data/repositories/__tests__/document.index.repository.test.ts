import { describe, expect, it, vi } from 'vitest';
import {
  DataCancelled,
  DataSuccess,
} from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GenerateDocumentIndexParams from '../../../core/params/generate.document.index.params';
import SaveDocumentIndexParams from '../../../core/params/save.document.index.params';
import UpdateDocumentIndexParams from '../../../core/params/update.document.index.params';
import DocumentIndexApiService from '../../api/document.index.api-service';
import DocumentIndexRepository from '../document.index.repository';
import { DocumentIndexLevelTypeEnum } from '../../../core/constant/DocumentIndexLevel.enum';

const bookResponse = {
  book_id: 10,
  book_status: 'completed',
  chapters: [
    {
      id: 22,
      title: 'Chapter 1',
      source_pages: { start: 7, end: 31 },
      lessons: [],
    },
  ],
};

describe('DocumentIndexRepository', () => {
  it('parses the generated book hierarchy from the create endpoint', async () => {
    vi.spyOn(DocumentIndexApiService.getInstance(), 'createIndex').mockResolvedValue({
      data: { status: true, data: bookResponse },
      statusCode: 200,
    });

    const result = await DocumentIndexRepository.getInstance().generateIndex(
      new GenerateDocumentIndexParams(17),
      { useStaticData: false },
    );

    expect(result).toBeInstanceOf(DataSuccess);
    expect(result.data).toMatchObject({ bookId: 10, bookStatus: 'completed' });
    expect(result.data?.chapters[0]).toMatchObject({ id: 22, title: 'Chapter 1' });
  });

  it('updates hierarchy rows and saves the document index', async () => {
    const service = DocumentIndexApiService.getInstance();
    vi.spyOn(service, 'updateIndex').mockResolvedValue({
      data: { status: true, data: bookResponse },
      statusCode: 200,
    });
    vi.spyOn(service, 'saveIndex').mockResolvedValue({
      data: { status: true, message: 'saved' },
      statusCode: 200,
    });
    const updateParams = new UpdateDocumentIndexParams(17, [
      {
        id: 22,
        level: DocumentIndexLevelTypeEnum.CHAPTER,
        title: 'Chapter 1',
        fromPdf: 7,
        toPdf: 31,
        printedPageLabel: '1-24',
        needsAdminReview: false,
      },
    ]);

    await expect(
      DocumentIndexRepository.getInstance().updateIndex(updateParams, { useStaticData: false }),
    ).resolves.toBeInstanceOf(DataSuccess);
    await expect(
      DocumentIndexRepository.getInstance().saveIndex(new SaveDocumentIndexParams(17), {
        useStaticData: false,
      }),
    ).resolves.toBeInstanceOf(DataSuccess);
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
