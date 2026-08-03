export const PlacementAnalysisFilterEnum = {
  all: 'all',
  strong: 'strong',
  average: 'average',
  weak: 'weak',
} as const;

export type PlacementAnalysisFilterEnum =
  (typeof PlacementAnalysisFilterEnum)[keyof typeof PlacementAnalysisFilterEnum];
