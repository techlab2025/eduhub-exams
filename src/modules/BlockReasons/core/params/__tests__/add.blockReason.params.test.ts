import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import AddBlockReasonsParams from '../add.blockReason.params';

describe('AddBlockReasonsParams', () => {
  it('maps translated titles', () => {
    const params = new AddBlockReasonsParams({
      translations: new TranslationParams({
        title: { en: 'Policy violation', ar: 'مخالفة السياسة' },
      }),
    });
    expect(params.toMap()).toMatchObject({
      translations: { title: { en: 'Policy violation', ar: 'مخالفة السياسة' } },
    });
  });
});
