import { describe, expect, it } from 'vitest';
import { PlanDurationTypeEnum } from '../../enums/plan.duration.enum';
import { PlanStatusEnum } from '../../enums/plan.status.enum';
import PlanDetailsModel from '../plan.details.model';

describe('PlanDetailsModel', () => {
  it('maps the complete documented show response into nested models', () => {
    const value = PlanDetailsModel.fromJson({
      id: 5,
      title: 'The Complete Plan',
      status: PlanStatusEnum.ACTIVE,
      highlight_badge: [{ id: 2, title: 'Most Popular' }],
      craeted_by: { id: 7, title: 'Ahmed Hawam' },
      created_at: '2026-06-20',
      last_update_at: '2026-07-05',
      'subscribers:': 1245,
      trail_days: 14,
      pricing: [{ price: 499, duration: 1, duration_type: PlanDurationTypeEnum.MONTH }],
      features: [
        {
          feature_id: 1,
          feature_title: 'Analytical Reports',
          sub_features: [{ id: 1, status: true, limit: 4 }],
        },
      ],
      active_log: [
        {
          user: { id: 9, name: 'Mona' },
          date: '2026-07-05',
          text: 'Updated pricing',
        },
      ],
    });

    expect(value).toMatchObject({
      id: 5,
      title: 'The Complete Plan',
      status: PlanStatusEnum.ACTIVE,
      highlightBadges: [{ id: 2, title: 'Most Popular' }],
      createdBy: { id: 7, title: 'Ahmed Hawam' },
      createdAt: '2026-06-20',
      lastUpdateAt: '2026-07-05',
      subscribers: 1245,
      trialDays: 14,
      pricing: [{ price: 499, duration: 1, durationType: PlanDurationTypeEnum.MONTH }],
      features: [
        {
          featureId: 1,
          featureTitle: 'Analytical Reports',
          subFeatures: [{ id: 1, status: true, limit: 4 }],
        },
      ],
      activeLog: [
        {
          user: { id: 9, name: 'Mona' },
          date: '2026-07-05',
          text: 'Updated pricing',
        },
      ],
    });
  });
});
