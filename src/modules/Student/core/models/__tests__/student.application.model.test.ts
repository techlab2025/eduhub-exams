import { expectTypeOf, it } from 'vitest';
import type { StudentApplicationModel } from '../student.application.model';

it('defines student application data', () => {
  expectTypeOf<StudentApplicationModel>().toMatchTypeOf<{
    registrationMethod: string;
    deviceUsed: string;
    operationSystem: string;
    appVersion: string;
    currentStatus: string;
    lastSeen: string;
  }>();
});
