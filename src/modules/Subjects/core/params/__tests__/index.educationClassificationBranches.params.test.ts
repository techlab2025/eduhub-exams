import { expect, it } from 'vitest';
import IndexEducationClassificationBranchesParams from '../index.educationClassificationBranches.params';

it('filters the full branch tree by education classification id', () => {
  expect(
    new IndexEducationClassificationBranchesParams({
      educationClassificationId: 42,
      withSubjects: true,
    }).toMap(),
  ).toEqual({
    with_pagination: 0,
    page: 1,
    per_page: 100,
    education_classification_id: 42,
    with_subject: true,
  });
});
