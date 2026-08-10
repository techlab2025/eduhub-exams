export const PlanDurationTypeEnum = {
  DAY: 1,
  WEEK: 2,
  MONTH: 3,
  YEAR: 4,
} as const;
export type PlanDurationTypeEnum = (typeof PlanDurationTypeEnum)[keyof typeof PlanDurationTypeEnum];
