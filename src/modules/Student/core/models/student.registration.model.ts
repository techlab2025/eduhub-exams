export default class StudentRegistrationModel {
  registerDate: string;
  authenticationMethod: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  constructor(data: {
    registerDate: string;
    authenticationMethod: string;
    email: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }) {
    this.registerDate = data.registerDate;
    this.authenticationMethod = data.authenticationMethod;
    this.email = data.email;
    this.emailVerified = data.emailVerified;
    this.phoneVerified = data.phoneVerified;
    Object.freeze(this);
  }
  static fromJson(json: Record<string, unknown>): StudentRegistrationModel {
    return new StudentRegistrationModel({
      registerDate: String(json.register_date ?? ''),
      authenticationMethod: String(json.authentication_method ?? ''),
      email: String(json.email ?? ''),
      emailVerified: Boolean(json.email_verified),
      phoneVerified: Boolean(json.phone_verified),
    });
  }
  static readonly example = StudentRegistrationModel.fromJson({
    register_date: '09 May 2022',
    authentication_method: 'Card',
    email: 'email',
    email_verified: true,
    phone_verified: true,
  });
}
