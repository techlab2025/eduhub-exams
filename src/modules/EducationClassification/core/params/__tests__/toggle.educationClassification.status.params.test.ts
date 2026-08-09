import { describe, expect, it } from 'vitest';
import ToggleStatusEducationClassificationParams from '../toggle.educationClassification.status.params';

describe('ToggleStatusEducationClassificationParams', () => {
  it('maps the classification id to the API field', () => {
    const params = new ToggleStatusEducationClassificationParams({ id: 7 });

    expect(params.toMap()).toEqual({ education_classification_id: 7 });
    expect(params.validate().isValid).toBe(true);
  });

  it('rejects a non-positive classification id', () => {
    const params = new ToggleStatusEducationClassificationParams({ id: 0 });

    expect(params.validate().isValid).toBe(false);
  });
});
