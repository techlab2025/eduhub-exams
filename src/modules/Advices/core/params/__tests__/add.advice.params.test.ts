import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import AddAdviceParams from '../add.advice.params';

describe('AddAdviceParams', () => {
  it('maps translated titles and descriptions', () => {
    const params = new AddAdviceParams({
      adviceCategoryId: 8,
      translations: new TranslationParams({
        title: { en: 'Plan title', ar: 'خطة' },
        description: { en: 'Plan description', ar: 'وصف الخطة' },
      }),
    });

    expect(params.toMap()).toMatchObject({
      advice_category_id: 8,
      translations: {
        title: { en: 'Plan title', ar: 'خطة' },
        description: { en: 'Plan description', ar: 'وصف الخطة' },
      },
    });
  });
});
