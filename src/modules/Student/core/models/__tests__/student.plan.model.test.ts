import { expectTypeOf, it } from 'vitest';
import type { StudentPlanModel } from '../student.plan.model';
import type { StudentStatusEnum } from '../student.model';

it('defines student plan data', () => {
  expectTypeOf<StudentPlanModel>().toMatchTypeOf<{
    id: number;
    title: string;
    planStatus: StudentStatusEnum;
    totalPaid: number;
    paymentMethod: string;
    subscribeDate: string;
    expireDate: string;
  }>();
});
