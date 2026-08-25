import { describe, expect, it } from 'vitest';
import StoreRoleParams from '../store.role.params';

describe('StoreRoleParams', () => {
  it('maps role_name and permissions to the store contract', () => {
    expect(new StoreRoleParams(' Content Manager ', ['OE01']).toMap()).toEqual({
      role_name: 'Content Manager',
      permissions: ['OE01'],
    });
  });
});
