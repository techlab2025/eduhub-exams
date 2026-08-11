export const PlanStatusEnum = {
  ACTIVE: 1,
  deactivated: 2,
  Archived: 3,
  DRAFT: 4,
} as const;
export type PlanStatusEnum = (typeof PlanStatusEnum)[keyof typeof PlanStatusEnum];
