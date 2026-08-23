import { expectTypeOf, it } from 'vitest';
import type { StudentRegistrationModel } from '../student.registration.model';

it('defines student registration data', () => {
  expectTypeOf<StudentRegistrationModel>().toMatchTypeOf<{
    registerDate: string;
    authenticationMethod: string;
    email: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }>();
});
