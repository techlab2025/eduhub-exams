import { describe, expect, it } from 'vitest';
import DocumentTypeModel from './document.type.model';

const createJson = (status: unknown) => ({
  id: 7,
  title: [{ locale: 'en', title: 'PDF' }],
  ref_number: 'DOC-7',
  document_type: { id: 1, title: 'Document' },
  subjtecs: [],
  tranaslations: {},
  status,
});

describe('DocumentTypeModel status', () => {
  it.each([true, 1, '1', 'active'])('maps %s to an active status', (status) => {
    expect(DocumentTypeModel.fromJson(createJson(status)).status).toBe(true);
  });

  it.each([false, 0, '0', 'inactive', undefined])('maps %s to an inactive status', (status) => {
    expect(DocumentTypeModel.fromJson(createJson(status)).status).toBe(false);
  });
});
