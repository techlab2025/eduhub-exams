import { describe, expect, it } from 'vitest';
import { AddStudentNoteParams } from '../add.student.note.params';

describe('AddStudentNoteParams', () => {
  it('maps the student id and trimmed note', () => {
    const params = new AddStudentNoteParams(15, '  Follow up tomorrow  ');

    expect(params.toMap()).toEqual({
      student_id: 15,
      note: 'Follow up tomorrow',
    });
    expect(params.validate().isValid).toBe(true);
  });

  it('rejects an empty note', () => {
    expect(new AddStudentNoteParams(15, '   ').validate().isValid).toBe(false);
  });
});
