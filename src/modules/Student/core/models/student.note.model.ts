import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';

export default class StudentNoteModel {
  public readonly id!: number;
  public readonly note!: string;
  public readonly createdAt!: string;
  public readonly createdBy!: { id: number; name: string } | null;

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
    const createdBy = SaftyConditions.objectValue(json.created_by);

    return new StudentNoteModel({
      id: Number(json.id ?? 0),
      note: String(json.note ?? ''),
      createdAt: String(json.created_at ?? ''),
      createdBy:
        Object.keys(createdBy).length > 0
          ? {
              id: Number(createdBy.id ?? 0),
              name: String(createdBy.name ?? ''),
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
