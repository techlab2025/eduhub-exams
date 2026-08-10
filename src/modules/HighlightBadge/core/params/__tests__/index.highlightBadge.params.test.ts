import { describe, expect, it } from 'vitest';
import IndexHighLightsBadgesParams from '../index.highlightBadge.params';

describe('IndexHighLightsBadgesParams', () => {
  it('maps search and pagination', () => {
    expect(
      new IndexHighLightsBadgesParams({ word: 'popular', pageNumber: 2, perPage: 20 }).toMap(),
    ).toMatchObject({ word: 'popular', page_number: 2, per_page: 20 });
  });
});
