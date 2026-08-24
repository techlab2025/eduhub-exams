import { expect, it } from 'vitest';
import AdviceCategoryTranslationParams from '../advice.category.translation.params';

it('maps category title translations', () => {
  expect(
    new AdviceCategoryTranslationParams({ title: { en: 'Planning', ar: 'التخطيط' } }).toMap(),
  ).toEqual({ title: { en: 'Planning', ar: 'التخطيط' } });
});
