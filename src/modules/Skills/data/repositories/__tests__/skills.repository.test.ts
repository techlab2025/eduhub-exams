import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import SkillsRepository from '../skills.repository';

describe('SkillsRepository', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('provides a stable singleton', () => {
    expect(SkillsRepository.getInstance()).toBe(SkillsRepository.getInstance());
  });
});
