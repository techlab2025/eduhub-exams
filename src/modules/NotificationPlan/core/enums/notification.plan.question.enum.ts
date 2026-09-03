export const NotificationPlanQuestionActionEnum = {
  Add_Question: 1,
  Approve_Question: 2,
  Reject_Question: 3,
  Edit_Question: 4,
} as const;

export type NotificationPlanQuestionActionEnum =
  (typeof NotificationPlanQuestionActionEnum)[keyof typeof NotificationPlanQuestionActionEnum];
