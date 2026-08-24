import { describe, expect, it } from 'vitest';
import { EmployeeStatusEnm } from '../../constant/employee.status.enum';
import { EmployeeTypeEnum } from '../../constant/employee.type.enum';
import { GenderENum } from '../../constant/gender.enum';
import EditEmployeeParams from '../edit.employee.params';

describe('EditEmployeeParams', () => {
  it('maps employee type and teacher subject ids to the API payload', () => {
    const params = new EditEmployeeParams({
      id: 7,
      firstname: 'Mona',
      lastname: 'Ali',
      email: 'mona@example.com',
      phone: '01000000000',
      image: '',
      EmployeeRef: 'EMP-1',
      gender: GenderENum.female,
      employeeStatus: EmployeeStatusEnm.active,
      password: '',
      employeeType: EmployeeTypeEnum.TEACHER,
      educationClassificationSubjectIds: [10, 12],
    });

    expect(params.toMap()).toMatchObject({
      employee_id: 7,
      employee_type: EmployeeTypeEnum.TEACHER,
      e_c_subject_ids: [10, 12],
    });
  });
});
