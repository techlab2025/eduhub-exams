import TitleInterface from '@/base/Data/Models/titleInterface';
import type StageModel from '@/modules/Stages/core/models/stage.model';

function flattenSubjectBranchTree(
  nodes: StageModel[],
  rootSubjectId?: number,
): TitleInterface<number>[] {
  return nodes.flatMap((node) => {
    const subjectId = rootSubjectId ?? node.e_c_subject_id ?? node.id;

    if (!node.children || node.children.length === 0) {
      return [
        new TitleInterface<number>({
          id: node.e_c_subject_id ?? node.id!,
          title: node.full_title,
          subtitle: subjectId,
        }),
      ];
    }

    return flattenSubjectBranchTree(node.children, subjectId);
  });
}

export default flattenSubjectBranchTree;
