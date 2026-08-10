export const PlanStatusEnum = {
  ACTIVE: 1,
  INACTIVE: 2,
  ARCHIVED: 3,
  DRAFT: 4,
} as const;
export type PlanStatusEnum = (typeof PlanStatusEnum)[keyof typeof PlanStatusEnum];
