import { describe, expect, it } from 'vitest';
import IndexAdviceParams from '../index.advice.params';

describe('IndexAdviceParams', () => {
  it('maps search and pagination using the documented request keys', () => {
    expect(new IndexAdviceParams({ word: 'study', page: 2, perPage: 20 }).toMap()).toEqual({
      word: 'study',
      with_pagination: 1,
      page: 2,
      per_page: 20,
    });
  });
});
