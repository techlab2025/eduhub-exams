import { describe, expect, it } from 'vitest';
import UpdateRoleParams from '../update.role.params';

describe('UpdateRoleParams', () => {
  it('adds role_id to the role payload', () => {
    expect(new UpdateRoleParams(3, { en: 'Support', ar: 'الدعم' }, ['OE02']).toMap()).toEqual({
      role_id: 3,
      translations: { title: { en: 'Support', ar: 'الدعم' } },
      permissions: ['OE02'],
    });
  });
});
