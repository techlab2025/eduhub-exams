import { expect, it } from 'vitest';
import AdviceApiService from '../advice.api-service';

it('uses a singleton advice API service', () => {
  expect(AdviceApiService.getInstance()).toBe(AdviceApiService.getInstance());
});
