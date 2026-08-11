export const LastUpdatedEnum = {
  TODAY: '1',
  LAST_7_DAYS: '2',
  LAST_30_DAYS: '3',
  LAST_3_MONTHS: '4',
  CUSTOM: '5',
} as const;
export type LastUpdatedEnum = (typeof LastUpdatedEnum)[keyof typeof LastUpdatedEnum];
