/**
 * Employee model representing an employee entity
 */
export default class EmployeeModel {
  public readonly id?: number;
  public readonly name: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly password?: string;
  public readonly image: string;
  public readonly isSuperadmin: boolean;
  public readonly role_id: number;
  public readonly status: number;
  public readonly subjects: string;
  
  

  constructor(data: {
    id?: number;
    name: string;
    email: string;
    phone: string;
    password?: string;
    image: string;
    isSuperadmin: boolean;
    role_id: number;
    status: number;
    subjects: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.image = data.image;
    this.isSuperadmin = data.isSuperadmin;
    this.role_id = data.role_id;
    this.status = data.status;
    this.subjects = data.subjects;

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

    return new EmployeeModel({
      id: json.id || json.employee_id,
      name: json.name || '',
      email: json.email || '',
      phone: json.phone || '',
      password: json.password,
      image: json.image || '',
      isSuperadmin: Boolean(json.isSuperadmin),
      role_id: Number(json.role_id || 0),
      status: Number(json.status || 0),
      subjects: json.subjects || '',
    });
  }

  static example: EmployeeModel = new EmployeeModel({
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123456789',
    image: 'https://example.com/image.jpg',
    isSuperadmin: false,
    role_id: 1,
    status: 1,
    subjects: 'Maths',
  });
}
