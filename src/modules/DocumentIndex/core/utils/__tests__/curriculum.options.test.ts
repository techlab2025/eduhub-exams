import { describe, expect, it } from 'vitest';
import {
  createSubjectOptions,
  findBranchById,
  flattenLeafBranchOptions,
  flattenSubjectConfigurationOptions,
  type CurriculumBranchNode,
} from '../curriculum.options';

const branches: CurriculumBranchNode[] = [
  {
    id: 361,
    title: 'Primary',
    children: [
      {
        id: 362,
        title: 'First',
        children: [],
        subjects: [
          {
            id: 284,
            e_c_subject_id: 284,
            title: 'Arabic',
            children: [
              {
                id: 308,
                e_c_subject_id: 308,
                title: 'Unit 1',
                children: [{ id: 309, title: 'Lesson 2', children: [] }],
              },
            ],
          },
        ],
      },
    ],
  },
];

describe('curriculum options', () => {
  it('creates branch options only for leaves with the complete path', () => {
    expect(flattenLeafBranchOptions(branches)).toEqual([
      expect.objectContaining({ id: 362, title: 'Primary → First' }),
    ]);
  });

  it('uses first-level subjects for the subject select', () => {
    const branch = findBranchById(branches, 362);

    expect(createSubjectOptions(branch?.subjects ?? [])).toEqual([
      expect.objectContaining({ id: 284, title: 'Arabic' }),
    ]);
  });

  it('uses the deepest child id and complete subject path for configurations', () => {
    const subject = findBranchById(branches, 362)?.subjects?.[0];

    expect(flattenSubjectConfigurationOptions(subject)).toEqual([
      expect.objectContaining({ id: 309, title: 'Arabic → Unit 1 → Lesson 2' }),
    ]);
  });
});
