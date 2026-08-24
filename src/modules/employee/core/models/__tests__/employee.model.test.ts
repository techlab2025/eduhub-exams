import { describe, it, expect } from 'vitest';
import EmployeeModel from '../employee.model';
import { EmployeeTypeEnum } from '../../constant/employee.type.enum';

describe('EmployeeModel', () => {
  const mockJson = {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '987654321',
    isSuperadmin: 1,
    role_id: 2,
    status: 1,
    subjects: 'Science',
    image: 'img.jpg',
  };

  it('should create an instance correctly from constructor', () => {
    const data = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      image: 'img.jpg',
      isSuperadmin: false,
      role_id: 1,
      status: 1,
      subjects: 'Math',
    };
    const model = new EmployeeModel(data);

    expect(model.name).toBe('John Doe');
    expect(model.isSuperadmin).toBe(false);
  });

  it('should create an instance correctly from fromJson', () => {
    const model = EmployeeModel.fromJson(mockJson);

    expect(model.id).toBe(1);
    expect(model.name).toBe('Jane Doe');
    expect(model.isSuperadmin).toBe(true);
    expect(model.status).toBe(1);
  });

  it('should throw error if json is null in fromJson', () => {
    expect(() => EmployeeModel.fromJson(null)).toThrow();
  });

  it('should have a valid example', () => {
    expect(EmployeeModel.example).toBeInstanceOf(EmployeeModel);
    expect(EmployeeModel.example.name).toBe('John Doe');
  });

  it('maps employee type and education classification subject ids', () => {
    const model = EmployeeModel.fromJson({
      ...mockJson,
      employee_type: EmployeeTypeEnum.TEACHER,
      subjects: [{ e_c_subject_id: 4 }, { id: 8 }],
    });

    expect(model.employeeType).toBe(EmployeeTypeEnum.TEACHER);
    expect(model.educationClassificationSubjectIds).toEqual([4, 8]);
  });
});
