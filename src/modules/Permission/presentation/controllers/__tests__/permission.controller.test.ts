import { describe, expect, it } from 'vitest';
import PermissionController from '../permission.controller';

describe('PermissionController', () => {
  it('is a singleton', () => {
    expect(PermissionController.getInstance()).toBe(PermissionController.getInstance());
  });
});
