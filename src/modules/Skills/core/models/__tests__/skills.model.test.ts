import { describe, expect, it } from 'vitest';
import SkillModel from '../skills.model';

describe('SkillModel', () => {
  it('maps the API identifier and preserves the translated title', () => {
    const title = [{ locale: 'en', title: 'Critical thinking' }];
    const model = SkillModel.fromJson({ skill_id: 17, title });

    expect(model).toEqual(expect.objectContaining({ id: 17, title }));
  });

  it('rejects an empty API response', () => {
    expect(() => SkillModel.fromJson(null)).toThrow();
  });
});
