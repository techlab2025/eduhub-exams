import { describe, expect, it } from 'vitest';
import { PlacementTotalRateEnum } from '../../../constant/placment.total.rate.enum';
import ResultAnalysisModel from '../result.analysis.mode';

describe('ResultAnalysisModel', () => {
  it('maps the API total_rate field', () => {
    const model = ResultAnalysisModel.fromJson({
      correct: 85,
      wrong: 10,
      Skipped: 5,
      total_rate: PlacementTotalRateEnum.excellent,
      precentage: 85,
    });

    expect(model.totalRate).toBe(PlacementTotalRateEnum.excellent);
  });
});
