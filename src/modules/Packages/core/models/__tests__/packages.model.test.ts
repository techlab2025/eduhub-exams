import { describe, it, expect } from 'vitest';
import PackageModel from '../packages.model';

describe('PackageModel', () => {
  const mockJson = {
    id: 1,
    package_name: 'Exam preparation',
    education_type: 'secondary',
    type: 'paid',
    contant: 10,
    price: 250,
    status: 'active',
    created_by: 'Admin',
  };

  it('maps the documented package response', () => {
    const model = PackageModel.fromJson(mockJson);

    expect(model).toEqual(
      expect.objectContaining({
        id: 1,
        packageName: 'Exam preparation',
        educationType: 'secondary',
        type: 'paid',
        contant: 10,
        price: 250,
        status: 'active',
        createdBy: 'Admin',
      }),
    );
  });

  it('rejects an empty response', () => {
    expect(() => PackageModel.fromJson(null)).toThrow();
  });
});
