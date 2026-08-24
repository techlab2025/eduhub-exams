import { describe, expect, it } from 'vitest';
import DocumentShowModel from '../document.show.model';

describe('DocumentShowModel', () => {
  it('maps the saved classification, branch, and subject selection', () => {
    const document = DocumentShowModel.fromJson({
      id: 10,
      title: [],
      description: [],
      stage: {
        id: 361,
        title: 'mostafa 1',
        titles: [{ locale: 'ar', title: 'مصطفي 1' }],
        education_classification: {
          id: 128,
          title: 'mostafa',
          titles: [{ locale: 'ar', title: 'مصطفي' }],
        },
      },
      subject: {
        id: 308,
        title: 'mostafa 2.1',
        parent_id: 284,
      },
    });

    expect(document.educationClassification).toMatchObject({ id: 128, title: 'mostafa' });
    expect(document.stage).toMatchObject({ id: 361, title: 'mostafa 1' });
    expect(document.subject).toMatchObject({ id: 308, title: 'mostafa 2.1' });
    expect(document.subjectParentId).toBe(284);
  });

  it('maps the full show-document response when the saved subject has no parent', () => {
    const document = DocumentShowModel.fromJson({
      id: 76,
      title: [{ locale: 'en', title: 'adsdasdas' }],
      description: [{ locale: 'en', description: 'asdsadas' }],
      document_type: {
        id: 28,
        title: [{ locale: 'en', title: 'asdad' }],
      },
      reference_number: '12312332',
      stage: {
        id: 361,
        title: 'mostafa 1',
        education_classification: { id: 128, title: 'mostafa' },
      },
      subject: {
        id: 285,
        e_c_subject_id: 285,
        title: 'mostafa 3',
        parent_id: null,
        education_classification: { id: 128, title: 'mostafa' },
        education_classification_branch: { id: 361, title: 'mostafa 1' },
      },
      tags: [{ tag: 'asdasdas' }],
    });

    expect(document.documentType).toMatchObject({ id: 28, title: 'asdad' });
    expect(document.educationClassification).toMatchObject({ id: 128, title: 'mostafa' });
    expect(document.stage).toMatchObject({ id: 361, title: 'mostafa 1' });
    expect(document.subject).toMatchObject({ id: 285, title: 'mostafa 3' });
    expect(document.subjectParentId).toBeUndefined();
  });
});
