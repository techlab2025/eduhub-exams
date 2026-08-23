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
  static fromJson(json: Record<string, unknown> | any): StudentEducationModel {
    const children = (json.children ?? []) as Record<string, unknown>[];
    return new StudentEducationModel(
      Number(json.id ?? 0),
      String(json.title ?? ''),
      children.map((child) => StudentEducationModel.fromJson(child)),
    );
  }
  static readonly example = StudentEducationModel.fromJson({
    id: 1,
    title: 'Basic',
    children: [],
  });
}
  