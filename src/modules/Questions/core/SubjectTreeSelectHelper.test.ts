import { describe, expect, it } from 'vitest';
import flattenSubjectBranchTree from './SubjectTreeSelectHelper';
import type StageModel from '@/modules/Stages/core/models/stage.model';

describe('flattenSubjectBranchTree', () => {
  it('keeps the outer subject id while using the leaf as the sequence id', () => {
    const tree = [
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
    ] as StageModel[];

    expect(flattenSubjectBranchTree(tree)).toEqual([
      expect.objectContaining({
        id: 308,
        subtitle: 284,
        title: 'mostafa 1 -> mostafa 2 -> mostafaf 2.1',
      }),
    ]);
  });
});
