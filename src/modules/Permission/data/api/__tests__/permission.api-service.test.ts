import { describe, expect, it } from 'vitest';
import PermissionApiService from '../permission.api-service';

describe('PermissionApiService', () => {
  it('is a singleton', () => {
    expect(PermissionApiService.getInstance()).toBe(PermissionApiService.getInstance());
  });
});
