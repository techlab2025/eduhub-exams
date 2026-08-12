import { describe, expect, it } from 'vitest';
import { StudentStatsParams } from '../student.stats.params';

describe('StudentStatsParams', () => {
  it('maps an empty statistics request', () => {
    expect(new StudentStatsParams().toMap()).toEqual({});
  });
});
