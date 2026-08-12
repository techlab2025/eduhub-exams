import { describe, expect, it } from 'vitest';
import SubscriptionUserModel from '../subscription.user.model';

describe('SubscriptionUserModel', () => {
  it('maps the subscription user response', () => {
    expect(SubscriptionUserModel.fromJson({ id: 4, name: 'Ahmed', serial: 'Stu-124' })).toEqual({
      id: 4,
      name: 'Ahmed',
      serial: 'Stu-124',
    });
  });
});
