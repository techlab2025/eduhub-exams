import { describe, it, expect, beforeEach } from 'vitest';
import LoginApiService from '../login.api-service';
import { LoginEndpoints } from '../login.api.endpoints';

const loginEndpoints = new LoginEndpoints();

describe('LoginApiService', () => {
  let service: LoginApiService;

  beforeEach(() => {
    service = LoginApiService.getInstance();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = LoginApiService.getInstance();
      const instance2 = LoginApiService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('endpoints configuration', () => {
    it('should have create endpoint mapped to login', () => {
      const serviceEndpoints = (service as any).endpoints;
      expect(serviceEndpoints.create).toBe(loginEndpoints.login);
    });
  });

  describe('login', () => {
    it('should be defined', () => {
      expect(service.login).toBeDefined();
      expect(typeof service.login).toBe('function');
    });
  });

  describe('generalLogin', () => {
    it('should be defined', () => {
      expect(service.generalLogin).toBeDefined();
      expect(typeof service.generalLogin).toBe('function');
    });
  });
});
