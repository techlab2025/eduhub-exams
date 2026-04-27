import { describe, it, expect } from 'vitest';
import AddEducationClassificationParams from '../add.educationClassification.params';

describe('AddEducationClassificationParams', () => {
  it('should create an instance with correct data', () => {
    const params = new AddEducationClassificationParams({ title: 'Basic Education' });

    expect(params.title).toBe('Basic Education');
  });

  it('should map to an object correctly', () => {
    const params = new AddEducationClassificationParams({ title: 'Higher Education' });

    const map = params.toMap();
    expect(map).toEqual({ title: 'Higher Education' });
  });

  it('should validate correctly with valid data', () => {
    const params = new AddEducationClassificationParams({ title: 'Basic Education' });

    const result = params.validate();
    expect(result.isValid).toBe(true);
  });

  it('should fail validation with short title', () => {
    const params = new AddEducationClassificationParams({ title: 'A' });

    const result = params.validate();
    expect(result.isValid).toBe(false);
  });
});
