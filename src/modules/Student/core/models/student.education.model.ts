import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import type { StudentTitleModel } from './student.model';

export class StudentEducationModel implements StudentTitleModel {
  readonly id!: number;
  readonly title!: string;
  readonly children!: StudentEducationModel[];
  constructor(id: number, title: string, children: StudentEducationModel[]) {
    this.id = id;
    this.title = title;
    this.children = children;
    Object.freeze(this);
  }
  static fromJson(json: Record<string, unknown>): StudentEducationModel {
    return new StudentEducationModel(
      Number(json.id ?? 0),
      String(json.title ?? ''),
      SaftyConditions.modelListCheck(json.children, StudentEducationModel),
    );
  }
  static readonly example = StudentEducationModel.fromJson({
    id: 1,
    title: 'Basic',
    children: [],
  });
}
