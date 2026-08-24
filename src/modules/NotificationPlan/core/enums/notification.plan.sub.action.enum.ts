export const NotificationPlanSubActionEnum = {
  LOW: 1,
  MEDIUM: 2,
  MEDIUM_IS_NEAR_MISS: 3,
  HIGH: 4,
} as const;

export type NotificationPlanSubActionEnum =
  (typeof NotificationPlanSubActionEnum)[keyof typeof NotificationPlanSubActionEnum];
