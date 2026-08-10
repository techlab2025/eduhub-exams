import { expect, it } from 'vitest';
import Controller from '../planFeature.controller';
it('uses a singleton controller', () =>
  expect(Controller.getInstance()).toBe(Controller.getInstance()));
