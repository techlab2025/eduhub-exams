import { expect, it } from 'vitest';
import Controller from '../plan.controller';
it('uses a singleton controller', () =>
  expect(Controller.getInstance()).toBe(Controller.getInstance()));
