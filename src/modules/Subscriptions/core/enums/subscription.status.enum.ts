export const SubscriptionStatusEnum = {
  ACTIVE: '1',
  EXPIRED: '2',
  CANCELLED: '3',
} as const;

export type SubscriptionStatusEnum =
  (typeof SubscriptionStatusEnum)[keyof typeof SubscriptionStatusEnum];
