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
      created_at: '2026-09-06',
      status: 1,
    });

    expect(model).toMatchObject({
      id: 5,
      title: 'Planning',
      translations: { en: 'Planning', ar: 'التخطيط' },
      createdAt: '2026-09-06',
      status: true,
    });
  });

  it('keeps optional table metadata empty when the API does not return it', () => {
    const model = AdviceCategoryModel.fromJson({ id: 6, title: 'Relaxation' });

    expect(model.createdAt).toBe('');
    expect(model.status).toBeNull();
  });
});
