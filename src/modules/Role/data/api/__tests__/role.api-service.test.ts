import { describe, expect, it } from 'vitest';
import RoleApiService from '../role.api-service';

describe('RoleApiService', () => {
  it('uses one shared API service instance', () => {
    expect(RoleApiService.getInstance()).toBe(RoleApiService.getInstance());
  });
});
