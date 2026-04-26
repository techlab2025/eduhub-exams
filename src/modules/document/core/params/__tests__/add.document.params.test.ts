import { describe, it, expect } from 'vitest';
import AddDocumentParams from '../add.document.params';

describe('AddDocumentParams', () => {
  it('should create an instance with correct data', () => {
    const params = new AddDocumentParams({
      title: 'Doc Title',
      subject_id: 1,
      stage_id: 2,
      unit_ids: [3, 4],
      document_type_id: 1,
      isAllUnits: false,
    });

    expect(params.title).toBe('Doc Title');
    expect(params.subject_id).toBe(1);
    expect(params.stage_id).toBe(2);
    expect(params.unit_ids).toEqual([3, 4]);
    expect(params.document_type_id).toBe(1);
    expect(params.isAllUnits).toBe(false);
  });

  it('should map to an object correctly', () => {
    const params = new AddDocumentParams({
      title: 'Doc Title',
      subject_id: 1,
      stage_id: 2,
      unit_ids: [3, 4],
      document_type_id: 1,
      isAllUnits: true,
    });

    const map = params.toMap();
    expect(map).toEqual({
      title: 'Doc Title',
      subject_id: 1,
      stage_id: 2,
      unit_ids: [3, 4],
      document_type_id: 1,
      isAllUnits: true,
    });
  });

  it('should validate correctly with valid data', () => {
    const params = new AddDocumentParams({
      title: 'Doc Title',
      subject_id: 1,
      stage_id: 2,
      unit_ids: [],
      document_type_id: 1,
      isAllUnits: true,
    });

    const result = params.validate();
    expect(result.isValid).toBe(true);
  });

  it('should fail validation with short title', () => {
    const params = new AddDocumentParams({
      title: 'A',
      subject_id: 1,
      stage_id: 2,
      unit_ids: [],
      document_type_id: 1,
      isAllUnits: true,
    });

    const result = params.validate();
    expect(result.isValid).toBe(false);
  });
});
