import { describe, it, expect } from 'vitest';
import EmailModel from './email.model';
import { EmailType } from '../constants/emailType.enum';

describe('EmailModel', () => {
    describe('constructor', () => {
        it('should create a valid email model', () => {
            const model = new EmailModel({
                id: 1,
                email: 'test@example.com',
                type: EmailType.WORK,
                employeeId: 10,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
            });

            expect(model.id).toBe(1);
            expect(model.email).toBe('test@example.com');
            expect(model.type).toBe(EmailType.WORK);
            expect(model.employeeId).toBe(10);
            expect(model.createdAt).toBe('2024-01-01T00:00:00Z');
            expect(model.updatedAt).toBe('2024-01-02T00:00:00Z');
        });

        it('should normalize email to lowercase', () => {
            const model = new EmailModel({
                email: 'Test@Example.COM',
            });

            expect(model.email).toBe('test@example.com');
        });

        it('should use default type when not provided', () => {
            const model = new EmailModel({
                email: 'test@example.com',
            });

            expect(model.type).toBe(EmailType.EMPLOYEE);
        });

        it('should throw error when email is missing', () => {
            expect(() => new EmailModel({
                email: '',
            })).toThrow('Email is required');
        });

        it('should throw error for invalid email format', () => {
            expect(() => new EmailModel({
                email: 'invalid-email',
            })).toThrow('Invalid email format');
        });

        it('should throw error for email without @', () => {
            expect(() => new EmailModel({
                email: 'notemail.com',
            })).toThrow('Invalid email format');
        });

        it('should throw error for email without domain', () => {
            expect(() => new EmailModel({
                email: 'test@',
            })).toThrow('Invalid email format');
        });

        it('should handle special characters in email', () => {
            const model = new EmailModel({
                email: 'test+tag@example.co.uk',
            });

            expect(model.email).toBe('test+tag@example.co.uk');
        });
    });

    describe('fromJson', () => {
        it('should create model from API response', () => {
            const json = {
                id: 5,
                email: 'api@example.com',
                type: EmailType.PERSONAL,
                employee_id: 20,
                created_at: '2024-01-10T00:00:00Z',
                updated_at: '2024-01-11T00:00:00Z',
            };

            const model = EmailModel.fromJson(json);

            expect(model.id).toBe(5);
            expect(model.email).toBe('api@example.com');
            expect(model.type).toBe(EmailType.PERSONAL);
            expect(model.employeeId).toBe(20);
            expect(model.createdAt).toBe('2024-01-10T00:00:00Z');
            expect(model.updatedAt).toBe('2024-01-11T00:00:00Z');
        });

        it('should use default type when not in JSON', () => {
            const json = {
                id: 1,
                email: 'default@example.com',
                employee_id: 10,
            };

            const model = EmailModel.fromJson(json);

            expect(model.type).toBe(EmailType.EMPLOYEE);
        });

        it('should throw error when JSON is null', () => {
            expect(() => EmailModel.fromJson(null)).toThrow('Cannot create EmailModel from null or undefined');
        });

        it('should throw error when JSON is undefined', () => {
            expect(() => EmailModel.fromJson(undefined)).toThrow('Cannot create EmailModel from null or undefined');
        });

        it('should throw error when email is invalid in JSON', () => {
            const json = {
                id: 1,
                email: 'invalid',
                employee_id: 10,
            };

            expect(() => EmailModel.fromJson(json)).toThrow('Invalid email format');
        });
    });

    describe('toJson', () => {
        it('should convert to API format with snake_case', () => {
            const model = new EmailModel({
                id: 3,
                email: 'export@example.com',
                type: EmailType.WORK,
                employeeId: 15,
                createdAt: '2024-02-01T00:00:00Z',
                updatedAt: '2024-02-02T00:00:00Z',
            });

            const json = model.toJson();

            expect(json).toEqual({
                id: 3,
                email: 'export@example.com',
                type: EmailType.WORK,
                employee_id: 15,
                created_at: '2024-02-01T00:00:00Z',
                updated_at: '2024-02-02T00:00:00Z',
            });
        });

        it('should handle undefined optional fields', () => {
            const model = new EmailModel({
                email: 'minimal@example.com',
            });

            const json = model.toJson();

            expect(json.email).toBe('minimal@example.com');
            expect(json.id).toBeUndefined();
            expect(json.employee_id).toBeUndefined();
        });
    });

    describe('utility methods', () => {
        describe('isValidEmail', () => {
            it('should return true for valid email', () => {
                const model = new EmailModel({
                    email: 'valid@example.com',
                });

                expect(model.isValidEmail()).toBe(true);
            });
        });

        describe('belongsToEmployee', () => {
            it('should return true when email belongs to employee', () => {
                const model = new EmailModel({
                    email: 'emp@example.com',
                    employeeId: 100,
                });

                expect(model.belongsToEmployee(100)).toBe(true);
            });

            it('should return false when email does not belong to employee', () => {
                const model = new EmailModel({
                    email: 'emp@example.com',
                    employeeId: 100,
                });

                expect(model.belongsToEmployee(200)).toBe(false);
            });

            it('should return false when employeeId is undefined', () => {
                const model = new EmailModel({
                    email: 'emp@example.com',
                });

                expect(model.belongsToEmployee(100)).toBe(false);
            });
        });

        describe('isWorkEmail', () => {
            it('should return true for work email', () => {
                const model = new EmailModel({
                    email: 'work@example.com',
                    type: EmailType.WORK,
                });

                expect(model.isWorkEmail()).toBe(true);
            });

            it('should return false for non-work email', () => {
                const model = new EmailModel({
                    email: 'personal@example.com',
                    type: EmailType.PERSONAL,
                });

                expect(model.isWorkEmail()).toBe(false);
            });
        });

        describe('isPersonalEmail', () => {
            it('should return true for personal email', () => {
                const model = new EmailModel({
                    email: 'personal@example.com',
                    type: EmailType.PERSONAL,
                });

                expect(model.isPersonalEmail()).toBe(true);
            });

            it('should return false for non-personal email', () => {
                const model = new EmailModel({
                    email: 'work@example.com',
                    type: EmailType.WORK,
                });

                expect(model.isPersonalEmail()).toBe(false);
            });
        });

        describe('toString', () => {
            it('should return formatted string', () => {
                const model = new EmailModel({
                    email: 'display@example.com',
                    type: EmailType.WORK,
                });

                expect(model.toString()).toBe('display@example.com (work)');
            });
        });
    });

    describe('immutability', () => {
        it('should have readonly properties', () => {
            const model = new EmailModel({
                id: 1,
                email: 'readonly@example.com',
                type: EmailType.EMPLOYEE,
                employeeId: 50,
            });

            // TypeScript enforces this at compile time, but we can check the property descriptor
            const descriptor = Object.getOwnPropertyDescriptor(model, 'email');
            expect(descriptor?.writable).toBe(false);
        });
    });

    describe('edge cases', () => {
        it('should handle very long valid email', () => {
            const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
            const model = new EmailModel({
                email: longEmail,
            });

            expect(model.email).toBe(longEmail.toLowerCase());
        });

        it('should handle email with multiple subdomains', () => {
            const model = new EmailModel({
                email: 'test@sub1.sub2.example.com',
            });

            expect(model.email).toBe('test@sub1.sub2.example.com');
        });

        it('should handle email with numbers and hyphens', () => {
            const model = new EmailModel({
                email: 'user123@test-domain-456.com',
            });

            expect(model.email).toBe('user123@test-domain-456.com');
        });
    });
});
