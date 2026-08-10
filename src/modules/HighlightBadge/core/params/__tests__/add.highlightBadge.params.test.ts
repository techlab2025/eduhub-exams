import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import AddHighLightsBadgesParams from '../add.highlightBadge.params';

describe('AddHighLightsBadgesParams', () => {
  it('maps translated titles', () => {
    const params = new AddHighLightsBadgesParams({
      translations: new TranslationParams({ title: { en: 'Popular', ar: 'شائع' } }),
    });
    expect(params.toMap()).toMatchObject({
      translations: { title: { en: 'Popular', ar: 'شائع' } },
    });
  });
});
