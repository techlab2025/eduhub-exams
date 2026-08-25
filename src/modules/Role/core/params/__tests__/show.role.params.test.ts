import { describe, expect, it } from 'vitest';
import ShowRoleParams from '../show.role.params';

describe('ShowRoleParams', () => {
  it('maps the role identifier', () => {
    expect(new ShowRoleParams(8).toMap()).toEqual({ role_id: 8 });
  });
});
