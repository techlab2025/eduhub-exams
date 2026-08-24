import { expect, it } from 'vitest';
import AdviceCategoryApiService from '../advice.category.api-service';

it('uses a singleton category API service', () => {
  expect(AdviceCategoryApiService.getInstance()).toBe(AdviceCategoryApiService.getInstance());
});
