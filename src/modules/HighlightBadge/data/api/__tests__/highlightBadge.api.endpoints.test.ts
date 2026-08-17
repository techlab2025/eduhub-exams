import { describe, expect, it } from 'vitest';
import { HighlightBadgeEndpoints } from '../highlightBadge.api.endpoints';
describe('HighlightBadgeEndpoints', () => {
  it('registers every CRUD endpoint', () => {
    const value = new HighlightBadgeEndpoints();
    expect([value.index, value.store, value.show, value.update, value.delete]).toEqual(
      expect.arrayContaining([
        expect.stringContaining('fetch_highlight_badges'),
        expect.stringContaining('store_highlight_badge'),
        expect.stringContaining('show_highlight_badge'),
        expect.stringContaining('update_highlight_badge'),
        expect.stringContaining('delete_highlight_badge'),
      ]),
    );
  });
});
