import { expectTypeOf, it } from 'vitest';
import type { StudentResultModel } from '../student.result.model';

it('defines student result data', () => {
  expectTypeOf<StudentResultModel>().toMatchTypeOf<{
    id: number;
    title: string;
    correctCount: number;
    wrongCount: number;
  }>();
});
