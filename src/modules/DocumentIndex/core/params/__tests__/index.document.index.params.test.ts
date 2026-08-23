import { describe, expect, it } from 'vitest';
import IndexDocumentIndexParams from '../index.document.index.params';

describe('IndexDocumentIndexParams', () => {
  it('sends the first-level subject id when no child is selected', () => {
    const params = new IndexDocumentIndexParams({ eCSubjectId: 284 });

    expect(params.toMap()).toMatchObject({
      e_c_subject_id: 284,
      with_pagination: 0,
    });
    expect(params.toMap()).not.toHaveProperty('e_c_subject_child_id');
  });

  it('sends only the child id when a subject configuration is selected', () => {
    const params = new IndexDocumentIndexParams({
      eCSubjectId: 284,
      eCSubjectChildId: 308,
    });

    expect(params.toMap()).toMatchObject({
      e_c_subject_child_id: 308,
      with_pagination: 0,
    });
    expect(params.toMap()).not.toHaveProperty('e_c_subject_id');
  });
});
