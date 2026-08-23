import { expectTypeOf, it } from 'vitest';
import type { StudentNoteModel } from '../student.note.model';

it('defines student note data', () => {
  expectTypeOf<StudentNoteModel>().toMatchTypeOf<{
    id: number;
    note: string;
    createdAt: string;
    createdBy: { id: number; name: string } | null;
  }>();
});
