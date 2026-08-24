import { expect, it } from 'vitest';
import AdviceCategoryRepository from '../advice.category.repository';

it('uses a singleton category repository', () => {
  expect(AdviceCategoryRepository.getInstance()).toBe(AdviceCategoryRepository.getInstance());
});
