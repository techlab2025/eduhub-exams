import { describe, it, expect } from 'vitest';
import EditEducationClassificationParams from '../edit.educationClassification.params';

describe('EditEducationClassificationParams', () => {
  it('should create an instance with correct data', () => {
    const params = new EditEducationClassificationParams(1, 'Basic Education');

    expect(params.title).toBe('Basic Education');
  });

  it('should map to an object correctly', () => {
    const params = new EditEducationClassificationParams(1, 'Higher Education');

    const map = params.toMap();
    expect(map).toEqual({ id: 1, title: 'Higher Education' });
  });

  it('should validate correctly with valid data', () => {
    const params = new EditEducationClassificationParams(1, 'Basic Education');

    const result = params.validate();
    expect(result.isValid).toBe(true);
  });

  it('should fail validation with short title', () => {
    const params = new EditEducationClassificationParams(1, 'A');

    const result = params.validate();
    expect(result.isValid).toBe(false);
  });
});
