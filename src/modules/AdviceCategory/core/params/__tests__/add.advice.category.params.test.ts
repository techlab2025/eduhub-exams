import { expect, it } from 'vitest';
import AddAdviceCategoryParams from '../add.advice.category.params';
import AdviceCategoryTranslationParams from '../advice.category.translation.params';

it('maps translated titles for category creation', () => {
  const params = new AddAdviceCategoryParams({
    translations: new AdviceCategoryTranslationParams({
      title: { en: 'Planning', ar: 'التخطيط' },
    }),
  });
  expect(params.toMap()).toEqual({
    translations: { title: { en: 'Planning', ar: 'التخطيط' } },
  });
});
