import { expect, it } from 'vitest';
import PlanActiveLogUserModel from '../plan.active.log.user.model';

it('maps an activity log user', () => {
  expect(PlanActiveLogUserModel.fromJson({ id: '4', name: 'Mona' })).toMatchObject({
    id: 4,
    name: 'Mona',
  });
});
