import { describe, expect, it } from 'vitest';
import { DocumentIndexPatchStatusEnum } from '../../constant/document.index.patch.status.enum';
import DocumentIndexPatchModel from '../document.index.patch.model';

describe('DocumentIndexPatchModel', () => {
  it('maps the fetch_document_index_patch response', () => {
    const model = DocumentIndexPatchModel.fromJson({
      id: 12,
      document_id: 17,
      employee: { id: 4, name: 'Indexing Employee' },
      created_by: { id: 2, full_name: 'Portal Admin' },
      created_at: '2026-08-26 15:30:00',
      status: '3',
      is_apply: 0,
    });

    expect(model).toEqual({
      id: 12,
      documentId: 17,
      employee: 'Indexing Employee',
      createdBy: 'Portal Admin',
      createdAt: '2026-08-26 15:30:00',
      status: DocumentIndexPatchStatusEnum.FAILED,
      isApply: false,
    });
  });
});
