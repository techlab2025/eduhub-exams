import { expect, it } from 'vitest';
import AdviceCategoryTranslationParams from '../advice.category.translation.params';
import EditAdviceCategoryParams from '../edit.advice.category.params';

it('maps the category id and translated titles for editing', () => {
  const params = new EditAdviceCategoryParams({
    adviceCategoryId: 4,
    translations: new AdviceCategoryTranslationParams({ title: { en: 'Planning' } }),
  });
  expect(params.toMap()).toEqual({
    advice_category_id: 4,
    translations: { title: { en: 'Planning' } },
  });
});
