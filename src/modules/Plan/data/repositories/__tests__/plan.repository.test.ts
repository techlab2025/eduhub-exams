import { expect, it } from 'vitest';
import Repository from '../plan.repository';
it('uses a singleton repository', () =>
  expect(Repository.getInstance()).toBe(Repository.getInstance()));
