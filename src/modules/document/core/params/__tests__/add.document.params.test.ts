import { describe, expect, it } from 'vitest';
import AddDocumentParams from '../add.document.params';
import DocumentTranslationParams from '../translation.params';

const makeParams = (overrides: Partial<ConstructorParameters<typeof AddDocumentParams>[0]> = {}) =>
  new AddDocumentParams({
    refNumber: 'REF-001',
    documentTypeId: 1,
    stage_id: 2,
    subjects: 3,
    translations: new DocumentTranslationParams({
      title: { en: 'Document title', ar: 'عنوان المستند' },
      description: { en: 'Description', ar: 'الوصف' },
    }),
    tags: ['tag1'],
    images: 'data:image/png;base64,aW1hZ2U=',
    files: 'data:application/pdf;base64,ZmlsZQ==',
    ...overrides,
  });

describe('AddDocumentParams', () => {
  it('stores the document form fields', () => {
    const params = makeParams();

    expect(params.refNumber).toBe('REF-001');
    expect(params.documentTypeId).toBe(1);
    expect(params.stage_id).toBe(2);
    expect(params.subjects).toBe(3);
    expect(params.tags).toEqual(['tag1']);
  });

  it('maps the current backend payload keys', () => {
    expect(makeParams().toMap()).toEqual({
      reference_number: 'REF-001',
      document_type_id: 1,
      stage_id: 2,
      subject_id: 3,
      translations: {
        title: { en: 'Document title', ar: 'عنوان المستند' },
        description: { en: 'Description', ar: 'الوصف' },
      },
      document_tags: ['tag1'],
      image: 'data:image/png;base64,aW1hZ2U=',
      document_file: 'data:application/pdf;base64,ZmlsZQ==',
    });
  });

  it('validates required fields', () => {
    expect(makeParams().validate().isValid).toBe(true);
    expect(makeParams({ refNumber: '' }).validate().isValid).toBe(false);
  });
});
