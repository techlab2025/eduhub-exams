import { describe, expect, it } from 'vitest';
import DeleteHighLightsBadgesParams from '../delete.highlightBadge.params';

describe('DeleteHighLightsBadgesParams', () => {
  it('maps the badge id', () => {
    expect(new DeleteHighLightsBadgesParams({ highlightBadgeId: 4 }).toMap()).toEqual({
      highlight_badge_id: 4,
    });
  });
});
