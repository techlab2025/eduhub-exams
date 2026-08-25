import { describe, expect, it } from 'vitest';
import EditDocumentParams from '../edit.document.params';
import DocumentTranslationParams from '../translation.params';

const makeParams = (overrides: Partial<ConstructorParameters<typeof EditDocumentParams>[0]> = {}) =>
  new EditDocumentParams({
    document_id: 10,
    documentTypeId: 1,
    stage_id: 2,
    subjects: 3,
    translations: new DocumentTranslationParams({
      title: { en: 'Updated title', ar: 'عنوان محدث' },
      description: { en: 'Updated description', ar: 'وصف محدث' },
    }),
    tags: ['updated'],
    images: ['data:image/png;base64,aW1hZ2U='],
    files: ['data:application/pdf;base64,ZmlsZQ=='],
    ...overrides,
  });

describe('EditDocumentParams', () => {
  it('stores the document form fields', () => {
    const params = makeParams();

    expect(params.document_id).toBe(10);
    expect(params.documentTypeId).toBe(1);
    expect(params.stage_id).toBe(2);
    expect(params.subjects).toBe(3);
  });

  it('maps the current backend payload and includes changed data URLs', () => {
    expect(makeParams().toMap()).toEqual({
      document_id: 10,
      document_type_id: 1,
      stage_id: 2,
      subject_id: 3,
      translations: {
        title: { en: 'Updated title', ar: 'عنوان محدث' },
        description: { en: 'Updated description', ar: 'وصف محدث' },
      },
      document_tags: ['updated'],
      image: 'data:image/png;base64,aW1hZ2U=',
      document_file: 'data:application/pdf;base64,ZmlsZQ==',
    });
  });

  it('does not resend unchanged URL assets', () => {
    const map = makeParams({
      images: ['https://cdn.example.test/image.png'],
      files: ['https://cdn.example.test/file.pdf'],
    }).toMap();

    expect(map).not.toHaveProperty('image');
    expect(map).not.toHaveProperty('document_file');
  });

  it('sends an asterisk for explicitly deleted assets', async () => {
    const params = await EditDocumentParams.prepare(
      makeParams({
        images: ['*'],
        files: ['*'],
      }),
    );

    expect(params.toMap()).toMatchObject({
      image: '*',
      document_file: '*',
    });
  });

  it('validates required fields', () => {
    expect(makeParams().validate().isValid).toBe(true);
    expect(makeParams({ subjects: null as never }).validate().isValid).toBe(false);
  });
});
