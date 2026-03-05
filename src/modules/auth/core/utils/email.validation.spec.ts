import { describe, it, expect } from 'vitest';
import {
    EMAIL_REGEX,
    MAX_EMAIL_LENGTH,
    MIN_EMAIL_LENGTH,
    isValidEmail,
    normalizeEmail,
    validateAndNormalizeEmail,
    extractEmailDomain,
    isEmailFromDomain,
} from './email.validation';

describe('Email Validation Utilities', () => {
    describe('EMAIL_REGEX', () => {
        it('should match valid email addresses', () => {
            const validEmails = [
                'test@example.com',
                'user.name@example.com',
                'user+tag@example.co.uk',
                'user_name@sub.example.com',
                'test123@test-domain.com',
            ];

            validEmails.forEach(email => {
                expect(EMAIL_REGEX.test(email)).toBe(true);
            });
        });

        it('should not match invalid email addresses', () => {
            const invalidEmails = [
                'notanemail',
                '@example.com',
                'user@',
                'user@@example.com',
                'user@.com',
            ];

            invalidEmails.forEach(email => {
                expect(EMAIL_REGEX.test(email)).toBe(false);
            });
        });
    });

    describe('isValidEmail', () => {
        it('should return true for valid emails', () => {
            expect(isValidEmail('valid@example.com')).toBe(true);
            expect(isValidEmail('user.name@example.co.uk')).toBe(true);
            expect(isValidEmail('test+tag@subdomain.example.com')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('missing@domain')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(isValidEmail('')).toBe(false);
        });

        it('should return false for null', () => {
            expect(isValidEmail(null as any)).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isValidEmail(undefined as any)).toBe(false);
        });

        it('should return false for non-string types', () => {
            expect(isValidEmail(123 as any)).toBe(false);
            expect(isValidEmail({} as any)).toBe(false);
            expect(isValidEmail([] as any)).toBe(false);
        });

        it('should handle emails with whitespace', () => {
            expect(isValidEmail('  valid@example.com  ')).toBe(true);
        });

        it('should return false for email too short', () => {
            expect(isValidEmail('a@b')).toBe(false);
        });

        it('should return false for email too long', () => {
            const longEmail = 'a'.repeat(250) + '@example.com';
            expect(isValidEmail(longEmail)).toBe(false);
        });

        it('should return false for multiple @ symbols', () => {
            expect(isValidEmail('user@@example.com')).toBe(false);
            expect(isValidEmail('user@test@example.com')).toBe(false);
        });

        it('should return false for domain without dot', () => {
            expect(isValidEmail('user@domain')).toBe(false);
        });
    });

    describe('normalizeEmail', () => {
        it('should convert to lowercase and trim', () => {
            expect(normalizeEmail('Test@Example.COM')).toBe('test@example.com');
        });

        it('should trim whitespace', () => {
            expect(normalizeEmail('  test@example.com  ')).toBe('test@example.com');
        });

        it('should return empty string for null', () => {
            expect(normalizeEmail(null as any)).toBe('');
        });

        it('should return empty string for undefined', () => {
            expect(normalizeEmail(undefined as any)).toBe('');
        });

        it('should return empty string for non-string', () => {
            expect(normalizeEmail(123 as any)).toBe('');
        });

        it('should handle already normalized email', () => {
            expect(normalizeEmail('test@example.com')).toBe('test@example.com');
        });
    });

    describe('validateAndNormalizeEmail', () => {
        it('should return normalized email for valid input', () => {
            expect(validateAndNormalizeEmail('Test@Example.COM')).toBe('test@example.com');
        });

        it('should throw error for invalid email', () => {
            expect(() => validateAndNormalizeEmail('invalid')).toThrow('Invalid email format');
        });

        it('should throw error for empty string', () => {
            expect(() => validateAndNormalizeEmail('')).toThrow('Invalid email format');
        });

        it('should handle whitespace and validate', () => {
            expect(validateAndNormalizeEmail('  Valid@Example.com  ')).toBe('valid@example.com');
        });
    });

    describe('extractEmailDomain', () => {
        it('should extract domain from valid email', () => {
            expect(extractEmailDomain('user@example.com')).toBe('example.com');
            expect(extractEmailDomain('test@sub.example.co.uk')).toBe('sub.example.co.uk');
        });

        it('should return empty string for invalid email', () => {
            expect(extractEmailDomain('invalid')).toBe('');
            expect(extractEmailDomain('user@')).toBe('');
        });

        it('should return empty string for empty input', () => {
            expect(extractEmailDomain('')).toBe('');
        });

        it('should handle complex domains', () => {
            expect(extractEmailDomain('user@mail.google.com')).toBe('mail.google.com');
        });
    });

    describe('isEmailFromDomain', () => {
        it('should return true when email is from domain', () => {
            expect(isEmailFromDomain('user@example.com', 'example.com')).toBe(true);
        });

        it('should return false when email is from different domain', () => {
            expect(isEmailFromDomain('user@example.com', 'other.com')).toBe(false);
        });

        it('should be case insensitive', () => {
            expect(isEmailFromDomain('user@Example.COM', 'example.com')).toBe(true);
            expect(isEmailFromDomain('user@example.com', 'Example.COM')).toBe(true);
        });

        it('should return false for invalid email', () => {
            expect(isEmailFromDomain('invalid', 'example.com')).toBe(false);
        });

        it('should return false for subdomain mismatch', () => {
            expect(isEmailFromDomain('user@sub.example.com', 'example.com')).toBe(false);
        });

        it('should match exact subdomain', () => {
            expect(isEmailFromDomain('user@sub.example.com', 'sub.example.com')).toBe(true);
        });
    });

    describe('constants', () => {
        it('should have correct MAX_EMAIL_LENGTH', () => {
            expect(MAX_EMAIL_LENGTH).toBe(254);
        });

        it('should have correct MIN_EMAIL_LENGTH', () => {
            expect(MIN_EMAIL_LENGTH).toBe(3);
        });
    });

    describe('edge cases and special characters', () => {
        it('should handle email with plus sign', () => {
            expect(isValidEmail('user+tag@example.com')).toBe(true);
        });

        it('should handle email with dots', () => {
            expect(isValidEmail('first.last@example.com')).toBe(true);
        });

        it('should handle email with underscores', () => {
            expect(isValidEmail('user_name@example.com')).toBe(true);
        });

        it('should handle email with hyphens in domain', () => {
            expect(isValidEmail('user@test-domain.com')).toBe(true);
        });

        it('should handle email with numbers', () => {
            expect(isValidEmail('user123@example456.com')).toBe(true);
        });

        it('should reject email with spaces', () => {
            expect(isValidEmail('user name@example.com')).toBe(false);
        });

        it('should reject email starting with dot', () => {
            expect(isValidEmail('.user@example.com')).toBe(false);
        });
    });
});
