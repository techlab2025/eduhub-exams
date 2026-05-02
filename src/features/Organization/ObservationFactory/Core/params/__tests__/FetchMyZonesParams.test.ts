import { describe, it, expect } from 'vitest';
import FetchMyZonesParams from '../FetchMyZonesParams';

describe('FetchMyZonesParams', () => {
  it('can be instantiated', () => {
    const params = new FetchMyZonesParams();
    expect(params).toBeInstanceOf(FetchMyZonesParams);
  });

  it('toMap returns an object', () => {
    const params = new FetchMyZonesParams();
    const map = params.toMap();
    expect(map).toBeDefined();
    expect(typeof map).toBe('object');
  });

  it('toMap returns an empty object', () => {
    const params = new FetchMyZonesParams();
    expect(params.toMap()).toEqual({});
  });
});
