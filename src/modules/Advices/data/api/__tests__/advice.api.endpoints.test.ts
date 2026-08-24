import { describe, expect, it } from 'vitest';
import { AdviceEndpoints } from '../advice.api.endpoints';

describe('AdviceEndpoints', () => {
  it('registers every documented CRUD endpoint', () => {
    const endpoints = new AdviceEndpoints();
    expect([
      endpoints.index,
      endpoints.store,
      endpoints.show,
      endpoints.update,
      endpoints.delete,
    ]).toEqual(
      expect.arrayContaining([
        expect.stringContaining('fetch_advices'),
        expect.stringContaining('store_advice'),
        expect.stringContaining('show_advice'),
        expect.stringContaining('edit_advice'),
        expect.stringContaining('delete_advice'),
      ]),
    );
  });
});
