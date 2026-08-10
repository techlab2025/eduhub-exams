import { expect, it } from 'vitest';
import Controller from '../highlightBadge.controller';
it('uses a singleton controller', () =>
  expect(Controller.getInstance()).toBe(Controller.getInstance()));
