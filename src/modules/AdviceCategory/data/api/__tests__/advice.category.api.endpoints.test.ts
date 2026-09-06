import { describe, expect, it } from 'vitest';
import { AdviceCategoryEndpoints } from '../advice.category.api.endpoints';

describe('AdviceCategoryEndpoints', () => {
  it('registers all category CRUD endpoints', () => {
    const endpoints = new AdviceCategoryEndpoints();
    expect([
      endpoints.index,
      endpoints.store,
      endpoints.show,
      endpoints.update,
      endpoints.delete,
    ]).toEqual(
      expect.arrayContaining([
        expect.stringContaining('fetch_advice_categories'),
        expect.stringContaining('store_advice_category'),
        expect.stringContaining('show_advice_category'),
        expect.stringContaining('update_advice_category'),
        expect.stringContaining('delete_advice_category'),
      ]),
    );
  });
});
