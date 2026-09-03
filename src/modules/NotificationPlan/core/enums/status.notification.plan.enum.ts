export const StatusNotificationPlanEnum = {
  inactive: '0',
  active: '1',
} as const;

export type StatusNotificationPlanEnum =
  (typeof StatusNotificationPlanEnum)[keyof typeof StatusNotificationPlanEnum];
