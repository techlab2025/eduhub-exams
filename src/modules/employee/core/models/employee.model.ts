import { GenderENum } from '../constant/gender.enum';
import { EmployeeTypeEnum } from '../constant/employee.type.enum';
import TitleInterface from '@/base/Data/Models/titleInterface';

/**
 * Employee model representing an employee entity
 */
export default class EmployeeModel {
  public readonly id?: number;
  public readonly firstname: string;
  public readonly lastname: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly password?: string;
  public readonly image: string;
  public readonly isSuperadmin: boolean;
  public readonly employeeId: string;
  public readonly status: number;
  public readonly subjects: TitleInterface<number>[];
  public readonly gender: GenderENum;
  public readonly employeeType: EmployeeTypeEnum;
  public readonly roleId?: number;
  public readonly roleName: string;
  public readonly educationClassificationSubjectIds: number[];

  get name(): string {
    return `${this.firstname.trim()} ${this.lastname.trim()}`.trim();
  }

  constructor(data: {
    id?: number;
    name?: string;
    firstname?: string;
    lastname?: string;
    email: string;
    phone: string;
    password?: string;
    image: string;
    isSuperadmin: boolean;
    employeeId?: string;
    status: number;
    subjects?: TitleInterface<number>[];
    gender?: GenderENum;
    employeeType?: EmployeeTypeEnum;
    roleId?: number;
    roleName?: string;
    educationClassificationSubjectIds?: number[];
  }) {
    this.id = data.id;
    this.firstname = data.firstname || data.name?.split(' ')[0] || '';
    this.lastname = data.lastname || data.name?.split(' ').slice(1).join(' ') || '';
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.image = data.image;
    this.isSuperadmin = data.isSuperadmin;
    this.employeeId = data.employeeId || '';
    this.status = data.status;
    this.subjects = data.subjects ?? [];
    this.gender = data.gender as GenderENum;
    this.employeeType = data.employeeType ?? EmployeeTypeEnum.ADMIN;
    this.roleId = data.roleId;
    this.roleName = data.roleName ?? '';
    this.educationClassificationSubjectIds =
      data.educationClassificationSubjectIds ?? this.subjects.map((subject) => subject.id);

    Object.freeze(this);
  }

  /**
   * Create EmployeeModel from API response
   * @param json - Raw JSON data from API
   * @returns EmployeeModel instance
   */
  static fromJson(json: any): EmployeeModel {
    if (!json) {
      throw new Error('Cannot create EmployeeModel from null or undefined');
    }

    const subjects: TitleInterface<number>[] = Array.isArray(json.subjects)
      ? json.subjects
          .map((subject: Record<string, unknown>) => {
            const id = Number(subject.e_c_subject_id ?? subject.id);
            if (!id) return null;
            return new TitleInterface<number>({
              id,
              title: String(subject.full_title ?? subject.title ?? id),
            });
          })
          .filter((subject: TitleInterface<number> | null): subject is TitleInterface<number> =>
            Boolean(subject),
          )
      : [];

    const role = (json.role ?? {}) as Record<string, unknown>;

    return new EmployeeModel({
      id: json.id || json.employee_id,
      firstname: json.first_name || json.name?.split(' ')[0] || '',
      lastname: json.last_name || json.name?.split(' ').slice(1).join(' ') || '',
      email: json.email || '',
      phone: json.phone || '',
      password: json.password,
      image: json.image ?? '',
      isSuperadmin: Boolean(json.isSuperadmin),
      employeeId: json.employee_ref || '',
      status: Number(json.status || 0),
      subjects,
      gender: json.gender,
      employeeType: Number(
        json.type ?? json.employee_type ?? json.employeeType ?? EmployeeTypeEnum.ADMIN,
      ) as EmployeeTypeEnum,
      roleId: Number(json.role_id ?? role.id ?? 0) || undefined,
      roleName: String(json.role_name ?? role.role_name ?? role.name ?? ''),
      educationClassificationSubjectIds: Array.isArray(json.e_c_subject_ids)
        ? json.e_c_subject_ids.map(Number)
        : Array.isArray(json.subjects)
          ? subjects.map((subject) => subject.id)
          : [],
    });
  }

  static example: EmployeeModel = new EmployeeModel({
    id: 1,
    firstname: 'John ',
    lastname: 'Doe',
    email: 'john@example.com',
    phone: '123456789',
    image: 'https://cyber.comolho.com/static/img/avatar.png',
    isSuperadmin: false,
    employeeId: 'EMP-545',
    status: 2,
    subjects: [],
    gender: GenderENum.male,
    employeeType: EmployeeTypeEnum.ADMIN,
    roleId: 1,
    roleName: 'Content Manager',
    educationClassificationSubjectIds: [],
  });
}
