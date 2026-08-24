import { describe, expect, it } from 'vitest';
import FullSubjectTreeParams from '../full.subject.tree.params';

describe('FullSubjectTreeParams', () => {
  it('maps the branch and selected parent subject filters', () => {
    const params = new FullSubjectTreeParams({ id: 361, parentId: 284 });

    expect(params.toMap()).toEqual({
      education_classification_branch_id: 361,
      parent_id: 284,
    });
  });

  it('keeps parent_id optional for existing consumers', () => {
    const params = new FullSubjectTreeParams({ id: 361 });

    expect(params.toMap()).toEqual({ education_classification_branch_id: 361 });
  });
});
