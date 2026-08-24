import { describe, expect, it } from 'vitest';
import { EmployeeTypeEnum } from '../employee.type.enum';

describe('EmployeeTypeEnum', () => {
  it('keeps the supported employee type values stable', () => {
    expect(EmployeeTypeEnum).toEqual({ ADMIN: 1, TEACHER: 2 });
  });
});
