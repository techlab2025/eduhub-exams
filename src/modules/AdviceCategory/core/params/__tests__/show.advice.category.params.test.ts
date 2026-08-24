import { expect, it } from 'vitest';
import ShowAdviceCategoryParams from '../show.advice.category.params';

it('maps the category id for show requests', () => {
  expect(new ShowAdviceCategoryParams({ adviceCategoryId: 4 }).toMap()).toEqual({
    advice_category_id: 4,
  });
});
