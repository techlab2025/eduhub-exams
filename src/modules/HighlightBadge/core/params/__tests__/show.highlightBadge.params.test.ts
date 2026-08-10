import { describe, expect, it } from 'vitest';
import ShowHighLightsBadgesParams from '../show.highlightBadge.params';

describe('ShowHighLightsBadgesParams', () => {
  it('maps the id and retains the locale option', () => {
    const params = new ShowHighLightsBadgesParams({ highlightBadgeId: 3, allLocales: true });
    expect(params.toMap()).toEqual({ highlight_badge_id: 3 });
    expect(params.allLocales).toBe(true);
  });
});
