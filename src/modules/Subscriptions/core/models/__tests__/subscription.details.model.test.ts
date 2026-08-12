import { describe, expect, it } from 'vitest';
import SubscriptionDetailsModel from '../subscription.details.model';
import SubscriptionEducationTypeModel from '../subscription.education-type.model';
import SubscriptionPlanModel from '../subscription.plan.model';
import SubscriptionUserModel from '../subscription.user.model';

describe('SubscriptionDetailsModel', () => {
  it('composes the user, education type, and plan models', () => {
    const details = SubscriptionDetailsModel.example;

    expect(details.user).toBeInstanceOf(SubscriptionUserModel);
    expect(details.educationType).toBeInstanceOf(SubscriptionEducationTypeModel);
    expect(details.plan).toBeInstanceOf(SubscriptionPlanModel);
  });
});
