import { describe, expect, it } from 'vitest';
import { PlanStatusEnum } from '../../enums/plan.status.enum';
import IndexPlanParams from '../index.plan.params';

describe('IndexPlanParams', () => {
  it('maps pagination and filters', () => {
    expect(
      new IndexPlanParams('premium', 2, 20, { status: PlanStatusEnum.ACTIVE }).toMap(),
    ).toMatchObject({
      word: 'premium',
      page: 2,
      per_page: 20,
      status: 1,
    });
  });
});
