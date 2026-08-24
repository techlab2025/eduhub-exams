import { expect, it } from 'vitest';
import IndexAdviceCategoryParams from '../index.advice.category.params';

it('fetches all categories for the dialog by default', () => {
  expect(new IndexAdviceCategoryParams().toMap()).toMatchObject({
    with_pagination: 0,
    page: 1,
    per_page: 10,
  });
});
