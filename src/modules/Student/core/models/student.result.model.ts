import type { StudentTitleModel } from './student.model';

export default class StudentResultModel implements StudentTitleModel {
  public readonly id!: number;
  public readonly title!: string;
  public readonly correctCount!: number;
  public readonly wrongCount!: number;
  constructor(data: { id: number; title: string; correctCount: number; wrongCount: number }) {
    this.id = data.id;
    this.title = data.title;
    this.correctCount = data.correctCount;
    this.wrongCount = data.wrongCount;
    Object.freeze(this);
  }
  static fromJson(json: Record<string, unknown>): StudentResultModel {
    return new StudentResultModel({
      id: Number(json.id ?? 0),
      title: String(json.title ?? ''),
      correctCount: Number(json.correct_count ?? 0),
      wrongCount: Number(json.wrong_count ?? 0),
    });
  }
  static readonly example = StudentResultModel.fromJson({
    id: 1,
    title: 'Arabic',
    correct_count: 240,
    wrong_count: 60,
  });
}
