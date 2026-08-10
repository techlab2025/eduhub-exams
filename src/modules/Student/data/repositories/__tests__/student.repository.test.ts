import { expect, it } from 'vitest';
import Repository from '../student.repository';
it('uses a singleton repository', () =>
  expect(Repository.getInstance()).toBe(Repository.getInstance()));
