import { expect, it } from 'vitest';
import Repository from '../planFeature.repository';
it('uses a singleton repository', () =>
  expect(Repository.getInstance()).toBe(Repository.getInstance()));
