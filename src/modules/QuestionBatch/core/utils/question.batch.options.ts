import TitleInterface from '@/base/Data/Models/titleInterface';

export interface QuestionBatchSubjectNode {
  id?: number;
  e_c_subject_id?: number;
  title?: string;
  children?: QuestionBatchSubjectNode[];
}

export interface QuestionBatchBranchNode {
  id?: number;
  title: string;
  children?: QuestionBatchBranchNode[];
  subjects?: QuestionBatchSubjectNode[];
}

export function flattenQuestionBatchBranches(
  branches: QuestionBatchBranchNode[],
  parents: string[] = [],
): TitleInterface<number>[] {
  return branches.flatMap((branch) => {
    const titles = [...parents, branch.title];
    if ((branch.children ?? []).length > 0) {
      return flattenQuestionBatchBranches(branch.children ?? [], titles);
    }
    return branch.id == null
      ? []
      : [new TitleInterface<number>({ id: branch.id, title: titles.join(' → ') })];
  });
}

export function findQuestionBatchBranch(
  branches: QuestionBatchBranchNode[],
  id?: number,
): QuestionBatchBranchNode | undefined {
  if (id == null) return undefined;
  for (const branch of branches) {
    if (branch.id === id) return branch;
    const child = findQuestionBatchBranch(branch.children ?? [], id);
    if (child) return child;
  }
  return undefined;
}

export function questionBatchSubjectOptions(
  subjects: QuestionBatchSubjectNode[],
): TitleInterface<number>[] {
  return subjects.flatMap((subject) => {
    const id = subject.e_c_subject_id ?? subject.id;
    return id == null ? [] : [new TitleInterface<number>({ id, title: subject.title ?? '' })];
  });
}
