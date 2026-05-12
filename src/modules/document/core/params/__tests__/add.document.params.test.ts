import { describe, it, expect } from 'vitest';
import AddDocumentParams from '../add.document.params';
import DocumentTranslationParams from '../translation.params';

const makeParams = (overrides: Partial<Record<string, unknown>> = {}) =>
  new AddDocumentParams({
    refNumber: 'REF-001',
    documentTypeId: 1,
    stage_id: 1,
    subjects: 1,
    translations: new DocumentTranslationParams({
      title: { en: 'Doc Title', ar: 'عنوان' },
      description: { en: 'Desc', ar: 'وصف' },
    }),
    tags: ['tag1'],
    images: [],
    files: [],
    ...(overrides as Record<string, unknown>),
  });

describe('AddDocumentParams', () => {
  it('should create an instance with correct data', () => {
    const params = makeParams();
    expect(params.refNumber).toBe('REF-001');
    expect(params.documentTypeId).toBe(1);
    expect(params.tags).toEqual(['tag1']);
  });

  it('should map to an object correctly', () => {
    const params = makeParams();
    const map = params.toMap();
    expect(map.reference_number).toBe('REF-001');
    expect(map.document_type_id).toBe(1);
    expect(map.translations.title.en).toBe('Doc Title');
  });

  it('should validate correctly with valid data', () => {
    const result = makeParams().validate();
    expect(result.isValid).toBe(true);
  });

  it('should fail validation with missing translations title', () => {
    const params = makeParams({
      translations: new DocumentTranslationParams({
        title: {} as Record<string, string>,
        description: { en: 'D' },
      }),
    });
    expect(params.validate().isValid).toBe(false);
  });
});
