import { describe, expect, it } from 'vitest';
import { DocumentIndexPatchStatusEnum } from '../../constant/document.index.patch.status.enum';
import DocumentIndexPatchModel from '../document.index.patch.model';

describe('DocumentIndexPatchModel', () => {
  it('maps the fetch_document_index_patch response', () => {
    const model = DocumentIndexPatchModel.fromJson({
      id: 12,
      document_id: 17,
      employee: { id: 4, name: 'Indexing Employee' },
      transaction_id: 'TXN-012',
      education_type: { id: 1, title: 'Governmental' },
      subject: {
        id: 2,
        title: 'Arabic',
        education_classification_branch: { id: 3, title: 'Chapter' },
      },
      document: { id: 17, title: 'Arabic Student Book' },
      created_by: { id: 2, full_name: 'Portal Admin' },
      created_at: '2026-08-26 15:30:00',
      status: '3',
      applied: false,
      generated_index: {
        book_id: 17,
        book_status: 'completed',
        chapters: [],
      },
    });

    expect(model).toEqual({
      id: 12,
      transactionId: 'TXN-012',
      documentId: 17,
      educationType: 'Governmental',
      subject: 'Arabic',
      subjectConfiguration: 'Chapter',
      documentTitle: 'Arabic Student Book',
      createdBy: 'Portal Admin',
      createdAt: '2026-08-26 15:30:00',
      status: DocumentIndexPatchStatusEnum.FAILED,
      isApply: false,
      generatedIndex: expect.objectContaining({ bookId: 17, bookStatus: 'completed' }),
    });
  });
});
