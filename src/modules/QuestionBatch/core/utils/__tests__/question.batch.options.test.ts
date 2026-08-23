import { describe, expect, it } from 'vitest';
import {
  findQuestionBatchBranch,
  flattenQuestionBatchBranches,
  questionBatchSubjectOptions,
} from '../question.batch.options';

const branches = [
  {
    id: 1,
    title: 'Primary',
    children: [{ id: 2, title: 'First', subjects: [{ e_c_subject_id: 3, title: 'Arabic' }] }],
  },
];

describe('question batch curriculum options', () => {
  it('flattens leaf paths and exposes first-level subjects', () => {
    expect(flattenQuestionBatchBranches(branches)[0]).toMatchObject({
      id: 2,
      title: 'Primary → First',
    });
    const branch = findQuestionBatchBranch(branches, 2);
    expect(questionBatchSubjectOptions(branch?.subjects ?? [])[0]).toMatchObject({
      id: 3,
      title: 'Arabic',
    });
  });
});
