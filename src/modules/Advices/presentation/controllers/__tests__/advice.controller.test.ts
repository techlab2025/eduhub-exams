import { expect, it } from 'vitest';
import AdviceController from '../advice.controller';

it('uses a singleton advice controller', () => {
  expect(AdviceController.getInstance()).toBe(AdviceController.getInstance());
});
