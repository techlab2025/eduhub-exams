import { expect, it } from 'vitest';
import DeleteAdviceCategoryParams from '../delete.advice.category.params';

it('maps the category id for deletion', () => {
  expect(new DeleteAdviceCategoryParams({ adviceCategoryId: 4 }).toMap()).toEqual({
    advice_category_id: 4,
  });
});
