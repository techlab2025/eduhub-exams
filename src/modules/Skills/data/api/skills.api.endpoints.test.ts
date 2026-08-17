import { describe, expect, it } from 'vitest';
import { SkillsEndpoints } from './skill.api.endpoints';

describe('SkillsEndpoints', () => {
  it('preserves every skills CRUD endpoint', () => {
    const endpoints = new SkillsEndpoints();

    expect(endpoints).toEqual(
      expect.objectContaining({
        index: expect.stringContaining('fetch_skills'),
        show: expect.stringContaining('show_skill'),
        store: expect.stringContaining('store_skill'),
        update: expect.stringContaining('update_skill'),
        delete: expect.stringContaining('delete_skill'),
      }),
    );
  });
});
