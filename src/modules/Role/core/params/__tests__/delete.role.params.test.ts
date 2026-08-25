import { describe, expect, it } from 'vitest';
import DeleteRoleParams from '../delete.role.params';

describe('DeleteRoleParams', () => {
  it('maps the role identifier', () => {
    expect(new DeleteRoleParams(9).toMap()).toEqual({ role_id: 9 });
  });
});
