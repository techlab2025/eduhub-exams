import { expect, it } from 'vitest';
import PlanActiveLogModel from '../plan.active.log.model';

it('maps an activity log entry and its user', () => {
  expect(
    PlanActiveLogModel.fromJson({
      user: { id: 4, name: 'Mona' },
      date: '2026-08-11',
      text: 'Archived plan',
    }),
  ).toMatchObject({
    user: { id: 4, name: 'Mona' },
    date: '2026-08-11',
    text: 'Archived plan',
  });
});
