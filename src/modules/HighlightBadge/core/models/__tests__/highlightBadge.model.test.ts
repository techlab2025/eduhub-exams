import { describe, expect, it } from 'vitest';
import HighlightBadgeModel from '../highlightBadge.model';
describe('HighlightBadgeModel', () => {
  it('maps badge responses', () => {
    expect(HighlightBadgeModel.fromJson({ highlight_badge_id: 4, title: 'Popular' })).toMatchObject(
      { id: 4, title: 'Popular' },
    );
  });
});
