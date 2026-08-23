import type TitleInterface from '@/base/Data/Models/titleInterface';

export default class StudentNoteModel {
  public readonly id!: number;
  public readonly note!: string;
  public readonly createdAt!: string;
  public readonly createdBy!: TitleInterface<string> | null;

  constructor(data: {
    id: number;
    note: string;
    createdAt: string;
    createdBy: { id: number; name: string } | null;
  }) {
    this.id = data.id;
    this.note = data.note;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): StudentNoteModel {
    return new StudentNoteModel({
      id: Number(json.id ?? 0),
      note: String(json.note ?? ''),
      createdAt: String(json.created_at ?? ''),
      createdBy:
        Object.keys(json.created_by ?? {}).length > 0
          ? {
              id: Number((json.created_by as Record<string, unknown>).id ?? 0),
              name: String((json.created_by as Record<string, unknown>).name ?? ''),
            }
          : null,
    });
  }

  static readonly example = new StudentNoteModel({
    id: 1,
    note: 'Note 1',
    createdAt: new Date().toISOString(),
    createdBy: {
      id: 1,
      name: 'Admin',
    },
  });
}
