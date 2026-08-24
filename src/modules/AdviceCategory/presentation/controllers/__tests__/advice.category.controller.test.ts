import { expect, it } from 'vitest';
import AdviceCategoryController from '../advice.category.controller';

it('uses a singleton category controller', () => {
  expect(AdviceCategoryController.getInstance()).toBe(AdviceCategoryController.getInstance());
});
