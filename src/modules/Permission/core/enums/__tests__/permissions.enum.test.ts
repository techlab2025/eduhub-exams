import { describe, expect, it } from 'vitest';
import { PermissionsEnum } from '../permissions.enum';

describe('PermissionsEnum', () => {
  it('uses the backend permission codes', () => {
    expect(PermissionsEnum.ADMIN_ALL).toBe('ADM00');
    expect(PermissionsEnum.EMPLOYEE_UPDATE).toBe('EMP04');
    expect(PermissionsEnum.QUESTION_UPDATE_REVIEW_STATUS).toBe('Q06');
    expect(PermissionsEnum.DOCUMENT_INDEX_FETCH_TRANSACTIONS).toBe('DI10');
  });
});
