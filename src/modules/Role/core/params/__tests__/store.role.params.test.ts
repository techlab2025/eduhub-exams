import { describe, expect, it } from 'vitest';
import StoreRoleParams from '../store.role.params';

describe('StoreRoleParams', () => {
  it('maps translated titles and permissions to the store contract', () => {
    expect(
      new StoreRoleParams({ en: ' Content Manager ', ar: ' مدير المحتوى ' }, ['OE01']).toMap(),
    ).toEqual({
      translations: { title: { en: 'Content Manager', ar: 'مدير المحتوى' } },
      permissions: ['OE01'],
    });
  });
});
