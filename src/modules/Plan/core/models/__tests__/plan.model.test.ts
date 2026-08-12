import { describe, expect, it } from 'vitest';
import { PlanDurationTypeEnum } from '../../enums/plan.duration.enum';
import { PlanStatusEnum } from '../../enums/plan.status.enum';
import PlanModel from '../plan.model';

describe('PlanModel', () => {
  it('maps the plan list response', () => {
    const value = PlanModel.fromJson({
      id: 8,
      title: 'Premium',
      duration: 2,
      duration_type: '3',
      price: 99,
      status: '1',
      trail_days: 7,
      number_of_subjects: 6,
      last_updated: {
        last_updated_person: { id: 7, name: 'Alice' },
        last_updated_date: '2026-08-11',
      },
    });

    expect(value).toMatchObject({
      id: 8,
      title: 'Premium',
      duration: 2,
      durationType: PlanDurationTypeEnum.MONTH,
      price: 99,
      status: PlanStatusEnum.ACTIVE,
      trialDays: 7,
      numberOfSubjects: 6,
      lastUpdated: {
        lastupdatedBy: { id: 7, name: 'Alice' },
        date: '2026-08-11',
      },
    });
  });
});
