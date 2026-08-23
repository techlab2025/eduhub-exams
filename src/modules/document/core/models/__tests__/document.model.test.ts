import { describe, expect, it } from 'vitest';
import DocumentModel from '../document.model';

describe('DocumentModel', () => {
  it('keeps the document-index card fields from the list response', () => {
    const document = DocumentModel.fromJson({
      id: 7,
      title: 'Arabic student book',
      description: 'Official student book',
      ref_number: 'DOC-ARB-001',
      document_type: { id: 2, title: 'Book' },
      image: '/book.png',
      document_file: '/book.pdf',
      document_index: { file: '/book-index.pdf' },
      subjtecs: [],
      tranaslations: {},
      tags: [],
      images: [],
      files: [],
    });

    expect(document).toMatchObject({
      description: 'Official student book',
      image: '/book.png',
      file: '/book.pdf',
      indexFile: '/book-index.pdf',
      hasIndex: true,
    });
  });
});
