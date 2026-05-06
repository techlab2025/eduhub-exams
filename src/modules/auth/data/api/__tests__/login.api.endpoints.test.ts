import { describe, it, expect } from 'vitest';
import { LoginEndpoints, GeneralLoginEndpoints } from '../login.api.endpoints';
import { baseUrl } from '@/base/Core/NetworkStructure/baseUrl';

describe('LoginEndpoints', () => {
  const endpoints = new LoginEndpoints();

  it('should generate correct login endpoint with dashboard prefix', () => {
    expect(endpoints.login).toBe(`${baseUrl}dashboard/login`);
  });
});

describe('GeneralLoginEndpoints', () => {
  const endpoints = new GeneralLoginEndpoints();

  it('should generate correct login endpoint with general prefix', () => {
    expect(endpoints.login).toBe(`${baseUrl}general/login`);
  });
});
