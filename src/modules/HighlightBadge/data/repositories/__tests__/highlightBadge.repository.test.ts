import { expect, it } from 'vitest';
import Repository from '../highlightBadge.repository';
it('uses a singleton repository', () =>
  expect(Repository.getInstance()).toBe(Repository.getInstance()));
