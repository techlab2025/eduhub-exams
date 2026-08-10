import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import { ShowHighlightBadgeParams, StoreHighlightBadgeParams } from '../highlightBadge.params';
describe('highlight badge params', () => {
  it('maps store and show payloads', () => {
    expect(
      new StoreHighlightBadgeParams(
        new TranslationParams({ title: { en: 'Popular', ar: 'شائع' } }),
      ).toMap(),
    ).toMatchObject({ translations: { title: { en: 'Popular', ar: 'شائع' } } });
    expect(new ShowHighlightBadgeParams(3).toMap()).toEqual({ highlight_badge_id: 3 });
  });
});
