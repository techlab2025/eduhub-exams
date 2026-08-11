import { expect, it } from 'vitest';
import PlanCreatedByModel from '../plan.created.by.model';

it('maps a plan creator', () => {
  expect(PlanCreatedByModel.fromJson({ id: '3', title: 'Ahmed' })).toMatchObject({
    id: 3,
    title: 'Ahmed',
  });
});
