import { describe, expect, it } from 'vitest';
import PlacementSkillAnalysisModel from '../placment.skill.analysis.model';

describe('PlacementSkillAnalysisModel', () => {
  it('provides a visible example skill', () => {
    expect(PlacementSkillAnalysisModel.example.skill?.title).toBe('Understanding');
    expect(PlacementSkillAnalysisModel.example.precentage).toBe(90);
  });
});
