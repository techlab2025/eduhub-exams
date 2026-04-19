import { describe, it, expect } from 'vitest';
import EmailParams from './email.params';
import { EmailType } from '../constants/emailType.enum';

describe('EmailParams', () => {
    describe('constructor', () => {
        it('should create valid params', () => {
            const params = new EmailParams('test@example.com', EmailType.WORK, 10);

            expect(params.email).toBe('test@example.com');
            expect(params.type).toBe(EmailType.WORK);
            expect(params.employeeId).toBe(10);
        });

        it('should use default type when not provided', () => {
            const params = new EmailParams('test@example.com');

            expect(params.type).toBe(EmailType.EMPLOYEE);
        });

        it('should create params without employeeId', () => {
            const params = new EmailParams('test@example.com', EmailType.PERSONAL);

            expect(params.email).toBe('test@example.com');
            expect(params.type).toBe(EmailType.PERSONAL);
            expect(params.employeeId).toBeUndefined();
        });
    });

    describe('validate', () => {
        it('should pass validation for valid params', () => {
            const params = new EmailParams('valid@example.com', EmailType.WORK, 5);
            const result = params.validate();

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should return validation result object', () => {
            const params = new EmailParams('test@example.com', EmailType.EMPLOYEE);
            const result = params.validate();

            expect(result).toHaveProperty('isValid');
            expect(result).toHaveProperty('errors');
        });

        it('should pass validation when employeeId is undefined', () => {
            const params = new EmailParams('test@example.com', EmailType.WORK);
            const result = params.validate();

            expect(result.isValid).toBe(true);
        });
    });

    describe('validateOrThrow', () => {
        it('should not throw for valid params', () => {
            const params = new EmailParams('valid@example.com', EmailType.WORK, 5);

            expect(() => params.validateOrThrow()).not.toThrow();
        });
    });

    describe('toMap', () => {
        it('should convert to map with all fields', () => {
            const params = new EmailParams('map@example.com', EmailType.PERSONAL, 20);
            const map = params.toMap();

            expect(map.email).toBe('map@example.com');
            expect(map.type).toBe(EmailType.PERSONAL);
            expect(map.id).toBe(20);
        });

        it('should convert to map without employeeId', () => {
            const params = new EmailParams('map@example.com', EmailType.WORK);
            const map = params.toMap();

            expect(map).toEqual({
                email: 'map@example.com',
                type: EmailType.WORK,
            });
            expect(map.id).toBeUndefined();
        });

        it('should map employeeId as id', () => {
            const params = new EmailParams('snake@example.com', EmailType.WORK, 15);
            const map = params.toMap();

            expect(map.id).toBe(15);
        });

        it('should not include id when employeeId is undefined', () => {
            const params = new EmailParams('test@example.com', EmailType.WORK);
            const map = params.toMap();

            expect('id' in map).toBe(false);
        });
    });

    describe('edge cases', () => {
        it('should handle email with special characters', () => {
            const params = new EmailParams('test+tag@sub.example.com', EmailType.WORK);

            expect(params.email).toBe('test+tag@sub.example.com');
        });

        it('should handle all email types', () => {
            const types = [
                EmailType.EMPLOYEE,
                EmailType.PERSONAL,
                EmailType.WORK,
                EmailType.OTHER,
            ];

            types.forEach(type => {
                const params = new EmailParams('test@example.com', type);
                expect(params.type).toBe(type);
            });
        });

        it('should handle large employee IDs', () => {
            const params = new EmailParams('test@example.com', EmailType.WORK, 999999999);

            expect(params.employeeId).toBe(999999999);
        });
    });

    describe('immutability after validation', () => {
        it('should maintain email after validation', () => {
            const params = new EmailParams('immutable@example.com', EmailType.WORK, 5);
            const originalEmail = params.email;

            params.validate();

            expect(params.email).toBe(originalEmail);
        });

        it('should maintain type after validation', () => {
            const params = new EmailParams('immutable@example.com', EmailType.PERSONAL, 5);
            const originalType = params.type;

            params.validate();

            expect(params.type).toBe(originalType);
        });
    });
});
