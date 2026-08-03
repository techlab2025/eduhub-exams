import { describe, expect, it } from 'vitest';
import { PlacementAnalysisFilterEnum } from '../placement.analysis.filter.enum';

describe('PlacementAnalysisFilterEnum', () => {
  it('defines every curriculum analysis filter', () => {
    expect(Object.values(PlacementAnalysisFilterEnum)).toEqual([
      'all',
      'strong',
      'average',
      'weak',
    ]);
  });
});
