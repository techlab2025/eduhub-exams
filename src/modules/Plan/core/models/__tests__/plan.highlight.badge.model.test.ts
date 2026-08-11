import { expect, it } from 'vitest';
import PlanHighlightBadgeModel from '../plan.highlight.badge.model';

it('maps a plan highlight badge', () => {
  expect(PlanHighlightBadgeModel.fromJson({ id: '2', title: 'Popular' })).toMatchObject({
    id: 2,
    title: 'Popular',
  });
});
