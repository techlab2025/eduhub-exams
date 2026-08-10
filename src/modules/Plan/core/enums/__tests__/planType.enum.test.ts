import { describe, expect, it } from 'vitest';
import {
  PLAN_FEATURE_DEFINITIONS,
  PlanFeatureSubTypeEnum,
  PlanFeatureTypeEnum,
} from '../planType.enum';

describe('plan feature enums', () => {
  it('defines the five feature groups and all twenty sub-types', () => {
    expect(PLAN_FEATURE_DEFINITIONS).toHaveLength(5);
    expect(PLAN_FEATURE_DEFINITIONS.flatMap((feature) => feature.subTypes)).toHaveLength(20);
    expect(PlanFeatureTypeEnum.REPORT).toBe(1);
    expect(PlanFeatureSubTypeEnum.MAXIMUM_FLASH_CARD_SETS).toBe(20);
  });

  it('marks numeric sub-types with their defaults', () => {
    const limited = PLAN_FEATURE_DEFINITIONS.flatMap((feature) => feature.subTypes).filter(
      (subType) => subType.defaultLimit !== undefined,
    );

    expect(limited.map((subType) => subType.defaultLimit)).toEqual([1, 5, 1, 1, 1, 20, 30, 15]);
  });
});
