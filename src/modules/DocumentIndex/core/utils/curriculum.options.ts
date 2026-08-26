import TitleInterface from '@/base/Data/Models/titleInterface';

export interface CurriculumSubjectNode {
  id?: number;
  e_c_subject_id?: number;
  subject_id?: number;
  title?: string;
  subject_title?: string;
  full_title?: string;
  children?: CurriculumSubjectNode[];
}

export interface CurriculumBranchNode {
  id?: number;
  e_c_branch_id?: number;
  title: string;
  full_title?: string;
  children?: CurriculumBranchNode[];
  subjects?: CurriculumSubjectNode[];
}

export function flattenLeafBranchOptions(
  branches: CurriculumBranchNode[],
  parentTitles: string[] = [],
): TitleInterface<number>[] {
  return branches.flatMap((branch) => {
    const titles = [...parentTitles, branch.title];
    const children = branch.children ?? [];

    if (children.length > 0) return flattenLeafBranchOptions(children, titles);
    const id = branch.e_c_branch_id ?? branch.id;
    if (id == null) return [];

    return [
      new TitleInterface<number>({
        id,
        title: branch.full_title || titles.filter(Boolean).join(' → '),
      }),
    ];
  });
}

export function findBranchById(
  branches: CurriculumBranchNode[],
  branchId?: number,
): CurriculumBranchNode | undefined {
  if (branchId == null) return undefined;

  for (const branch of branches) {
    if (branch.id === branchId) return branch;

    const match = findBranchById(branch.children ?? [], branchId);
    if (match) return match;
  }

  return undefined;
}

export function createSubjectOptions(subjects: CurriculumSubjectNode[]): TitleInterface<number>[] {
  return subjects.flatMap((subject) => {
    const id = subject.subject_id ?? subject.e_c_subject_id ?? subject.id;
    if (id == null) return [];

    return [
      new TitleInterface<number>({
        id,
        title: subject.subject_title ?? subject.full_title ?? subject.title ?? '',
      }),
    ];
  });
}

export function flattenSubjectConfigurationOptions(
  subject: CurriculumSubjectNode | undefined,
): TitleInterface<number>[] {
  if (!subject) return [];

  const rootTitle = subject.title ?? '';

  const visit = (
    children: CurriculumSubjectNode[],
    parentTitles: string[],
  ): TitleInterface<number>[] =>
    children.flatMap((child) => {
      const title = child.title ?? '';
      const titles = [...parentTitles, title];
      const descendants = child.children ?? [];

      if (descendants.length > 0) return visit(descendants, titles);

      const id = child.e_c_subject_id ?? child.id;
      if (id == null) return [];

      return [new TitleInterface<number>({ id, title: titles.filter(Boolean).join(' → ') })];
    });

  return visit(subject.children ?? [], [rootTitle].filter(Boolean));
}

export function findSubjectById(
  subjects: CurriculumSubjectNode[],
  subjectId?: number,
): CurriculumSubjectNode | undefined {
  return subjects.find((subject) => (subject.e_c_subject_id ?? subject.id) === subjectId);
}
