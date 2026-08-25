import { describe, expect, it } from 'vitest';
import RoleController from '../role.controller';

describe('RoleController', () => {
  it('uses one shared controller instance', () => {
    expect(RoleController.getInstance()).toBe(RoleController.getInstance());
  });
});
