import { describe, expect, it } from 'vitest';
import SubscriptionEducationTypeModel from '../subscription.education-type.model';

describe('SubscriptionEducationTypeModel', () => {
  it('maps the education type response', () => {
    expect(SubscriptionEducationTypeModel.fromJson({ id: 2, title: 'Primary' })).toEqual({
      id: 2,
      title: 'Primary',
    });
  });
});
