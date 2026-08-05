import { describe, expect, it } from 'vitest';
import StudentSkillProgressModel from '../student.skill.progress.model';

describe('StudentSkillProgressModel', () => {
  it('maps the backend percentage', () => {
    const model = StudentSkillProgressModel.fromJson({ exam_number: 2, percentage: 35 });

    expect(model.examNumber).toBe(2);
    expect(model.percentage).toBe(35);
  });
});
