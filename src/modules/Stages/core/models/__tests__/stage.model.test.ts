import { describe, expect, it } from 'vitest';
import StageModel from '../stage.model';

describe('StageModel', () => {
  it('preserves recursive subjects returned with a branch tree', () => {
    const branch = StageModel.fromJson({
      id: 361,
      e_c_branch_id: 361,
      title: 'mostafa 1',
      full_title: 'mostafa 1',
      children: [],
      subjects: [
        {
          id: 284,
          e_c_subject_id: 284,
          title: 'mostafa 2',
          full_title: 'mostafa 1 -> mostafa 2',
          children: [
            {
              id: 308,
              e_c_subject_id: 308,
              title: 'mostafaf 2.1',
              full_title: 'mostafa 1 -> mostafa 2 -> mostafaf 2.1',
              children: [],
            },
          ],
        },
      ],
    });

    expect(branch.subjects[0]).toMatchObject({
      id: 284,
      e_c_subject_id: 284,
      full_title: 'mostafa 1 -> mostafa 2',
    });
    expect(branch.subjects[0]?.children[0]).toMatchObject({ id: 308 });
    expect(branch.e_c_branch_id).toBe(361);
  });
});
