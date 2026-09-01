import { describe, expect, it } from 'vitest';
import { DocumentIndexPatchStatusEnum } from '../../constant/document.index.patch.status.enum';
import DocumentIndexStatusModel from '../document.index.status.model';

describe('DocumentIndexStatusModel', () => {
  it('maps status flags and the completed generated index', () => {
    const model = DocumentIndexStatusModel.fromJson({
      status: 2,
      applied: true,
      document_id: 17,
      generated_index: {
        book_id: 17,
        book_status: 'completed',
        chapters: [{ id: 22, title: 'Chapter 1', source_pages: { start: 1, end: 10 } }],
      },
    });

    expect(model.status).toBe(DocumentIndexPatchStatusEnum.COMPLETE);
    expect(model.isApply).toBe(true);
    expect(model.documentId).toBe(17);
    expect(model.generatedIndex).toMatchObject({ bookId: 17, bookStatus: 'completed' });
    expect(model.generatedIndex.chapters[0]?.title).toBe('Chapter 1');
  });

  it('maps the index_status field returned by the refresh endpoint', () => {
    const model = DocumentIndexStatusModel.fromJson({
      transaction_id: 90,
      index_status: 'completed',
      is_apply: false,
      document_id: 147,
      document_index: {
        book_id: 147,
        book_status: 'completed',
        chapters: [],
      },
    });

    expect(model.status).toBe(DocumentIndexPatchStatusEnum.COMPLETE);
    expect(model.documentId).toBe(147);
  });
});
