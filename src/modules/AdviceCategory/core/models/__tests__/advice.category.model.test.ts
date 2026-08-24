import { describe, expect, it } from 'vitest';
import AdviceCategoryModel from '../advice.category.model';

describe('AdviceCategoryModel', () => {
  it('maps localized category titles', () => {
    const model = AdviceCategoryModel.fromJson({
      advice_category_id: 5,
      title: [
        { locale: 'en', title: 'Planning' },
        { locale: 'ar', title: 'التخطيط' },
      ],
    });

    expect(model).toMatchObject({
      id: 5,
      title: 'Planning',
      translations: { en: 'Planning', ar: 'التخطيط' },
    });
  });
});
