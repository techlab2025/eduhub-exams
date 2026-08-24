export const NotificationPlanActionEnum = {
  COURSE_ASSIGEND: 1,
} as const;

export type NotificationPlanActionEnum =
  (typeof NotificationPlanActionEnum)[keyof typeof NotificationPlanActionEnum];
