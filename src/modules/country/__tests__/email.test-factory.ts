import TestDataFactory from '@/base/Core/Testing/testDataFactory';
import EmailModel from '../core/models/email.model';
import { EmailType } from '../core/constants/emailType.enum';

/**
 * Test data factory for email-related test data
 * Provides utilities to create mock emails for testing
 */
export class EmailTestFactory extends TestDataFactory {
    /**
     * Create a mock EmailModel with default or custom values
     */
    static createMockEmail(overrides?: Partial<{
        id: number;
        email: string;
        type: EmailType;
        employeeId: number;
        createdAt: string;
        updatedAt: string;
    }>): EmailModel {
        return new EmailModel({
            id: overrides?.id ?? this.randomInt(1, 1000),
            email: overrides?.email ?? `test${this.randomInt()}@example.com`,
            type: overrides?.type ?? EmailType.EMPLOYEE,
            employeeId: overrides?.employeeId ?? this.randomInt(1, 100),
            createdAt: overrides?.createdAt ?? new Date().toISOString(),
            updatedAt: overrides?.updatedAt ?? new Date().toISOString(),
        });
    }

    /**
     * Create a mock API JSON response for an email (snake_case)
     */
    static createMockEmailJson(overrides?: Partial<{
        id: number;
        email: string;
        type: EmailType;
        employee_id: number;
        created_at: string;
        updated_at: string;
    }>): any {
        return {
            id: overrides?.id ?? this.randomInt(1, 1000),
            email: overrides?.email ?? `test${this.randomInt()}@example.com`,
            type: overrides?.type ?? EmailType.EMPLOYEE,
            employee_id: overrides?.employee_id ?? this.randomInt(1, 100),
            created_at: overrides?.created_at ?? new Date().toISOString(),
            updated_at: overrides?.updated_at ?? new Date().toISOString(),
        };
    }

    /**
     * Create an array of mock emails
     */
    static createMockEmailList(count: number = 5): EmailModel[] {
        return this.generateArray(count, (index) =>
            this.createMockEmail({
                id: index + 1,
                email: `employee${index + 1}@example.com`,
            })
        );
    }

    /**
     * Create an array of mock email JSON responses
     */
    static createMockEmailJsonList(count: number = 5): any[] {
        return this.generateArray(count, (index) =>
            this.createMockEmailJson({
                id: index + 1,
                email: `employee${index + 1}@example.com`,
            })
        );
    }

    /**
     * Create a successful API response for a single email
     */
    static createEmailApiResponse(email?: EmailModel | any) {
        const emailData = email?.toJson ? email.toJson() : (email ?? this.createMockEmailJson());
        return this.apiResponse(emailData, true, 'Email retrieved successfully');
    }

    /**
     * Create a successful API response for a list of emails
     */
    static createEmailListApiResponse(emails?: EmailModel[] | any[]) {
        const emailsData = emails?.map((e: any) => e.toJson ? e.toJson() : e) ?? this.createMockEmailJsonList();
        return this.apiResponse(emailsData, true, 'Emails retrieved successfully');
    }

    /**
     * Create invalid email data for negative testing
     */
    static createInvalidEmailData(): any {
        return {
            id: 1,
            email: 'not-a-valid-email',  // Invalid format
            type: EmailType.WORK,
            employee_id: 10,
        };
    }

    /**
     * Create email with missing required fields
     */
    static createIncompleteEmailData(): any {
        return {
            id: 1,
            // email is missing
            type: EmailType.WORK,
        };
    }

    /**
     * Create malformed email data for error testing
     */
    static createMalformedEmailData(): any {
        return {
            id: 'not-a-number',
            email: 'test@example.com',
            type: 'invalid-type',
            employee_id: 'not-a-number',
        };
    }

    /**
     * Create email with boundary values
     */
    static createBoundaryEmail(boundary: 'min' | 'max'): EmailModel {
        if (boundary === 'min') {
            return new EmailModel({
                id: 1,
                email: 'a@b.c',  // Minimum valid length
                type: EmailType.EMPLOYEE,
                employeeId: 1,
            });
        } else {
            const longLocal = 'a'.repeat(64);
            const longDomain = 'b'.repeat(63);
            return new EmailModel({
                id: 999999,
                email: `${longLocal}@${longDomain}.com`,
                type: EmailType.OTHER,
                employeeId: 999999,
            });
        }
    }

    /**
     * Create emails with different types
     */
    static createEmailsByType(): EmailModel[] {
        return Object.values(EmailType).map((type, index) =>
            this.createMockEmail({
                id: index + 1,
                email: `${type}${index}@example.com`,
                type: type as EmailType,
            })
        );
    }

    /**
     * Create error response for testing error handling
     */
    static createErrorEmailResponse(message: string = 'Email operation failed', statusCode: number = 500) {
        return this.errorApiResponse(message, statusCode);
    }

    /**
     * Create empty response for testing empty state
     */
    static createEmptyEmailListResponse() {
        return this.apiResponse([], true, 'No emails found');
    }

    /**
     * Create partially valid email list (some valid, some invalid)
     */
    static createPartiallyValidEmailList(): any[] {
        return [
            this.createMockEmailJson({ email: 'valid1@example.com' }),
            this.createInvalidEmailData(),
            this.createMockEmailJson({ email: 'valid2@example.com' }),
            this.createIncompleteEmailData(),
        ];
    }
}

export default EmailTestFactory;
