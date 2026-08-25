import { describe, expect, it } from 'vitest';
import IndexRoleParams from '../index.role.params';

describe('IndexRoleParams', () => {
  it('maps search and pagination values', () => {
    expect(new IndexRoleParams('manager', 2, 20, 1).toMap()).toMatchObject({
      word: 'manager',
      page: 2,
      per_page: 20,
    });
  });
});
