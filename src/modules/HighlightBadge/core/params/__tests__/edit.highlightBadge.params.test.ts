import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import EditHighLightsBadgesParams from '../edit.highlightBadge.params';

describe('EditHighLightsBadgesParams', () => {
  it('maps the id and translated titles', () => {
    const params = new EditHighLightsBadgesParams({
      highlightBadgeId: 3,
      translations: new TranslationParams({ title: { en: 'Popular' } }),
    });
    expect(params.toMap()).toMatchObject({ highlight_badge_id: 3 });
  });
});
