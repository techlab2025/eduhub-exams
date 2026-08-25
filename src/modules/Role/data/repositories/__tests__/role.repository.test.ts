import { describe, expect, it } from 'vitest';
import RoleRepository from '../role.repository';

describe('RoleRepository', () => {
  it('uses one shared repository instance', () => {
    expect(RoleRepository.getInstance()).toBe(RoleRepository.getInstance());
  });
});
