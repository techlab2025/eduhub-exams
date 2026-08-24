import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import EditAdviceParams from '../edit.advice.params';

describe('EditAdviceParams', () => {
  it('maps the advice id and translations', () => {
    const params = new EditAdviceParams({
      adviceId: 3,
      translations: new TranslationParams({
        title: { en: 'Plan title' },
        description: { en: 'Plan description' },
      }),
    });

    expect(params.toMap()).toMatchObject({ advice_id: 3 });
  });
});
