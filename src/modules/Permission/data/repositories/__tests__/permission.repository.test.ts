import { describe, expect, it } from 'vitest';
import PermissionRepository from '../permission.repository';

describe('PermissionRepository', () => {
  it('is a singleton', () => {
    expect(PermissionRepository.getInstance()).toBe(PermissionRepository.getInstance());
  });
});
