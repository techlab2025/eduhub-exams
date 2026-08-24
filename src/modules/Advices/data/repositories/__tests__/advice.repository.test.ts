import { expect, it } from 'vitest';
import AdviceRepository from '../advice.repository';

it('uses a singleton advice repository', () => {
  expect(AdviceRepository.getInstance()).toBe(AdviceRepository.getInstance());
});
