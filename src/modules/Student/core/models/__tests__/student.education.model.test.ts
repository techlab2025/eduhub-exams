import { expectTypeOf, it } from 'vitest';
import type { StudentEducationModel } from '../student.education.model';

it('defines recursive student education data', () => {
  expectTypeOf<StudentEducationModel>().toMatchTypeOf<{
    id: number;
    title: string;
    children: StudentEducationModel[];
  }>();
});
