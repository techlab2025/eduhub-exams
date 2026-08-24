export const EmployeeTypeEnum = {
  ADMIN: 1,
  TEACHER: 2,
} as const;

export type EmployeeTypeEnum = (typeof EmployeeTypeEnum)[keyof typeof EmployeeTypeEnum];
