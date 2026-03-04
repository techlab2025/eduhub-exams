import { EmailType } from "../constants/emailType.enum";
import { isValidEmail, normalizeEmail } from "../utils/email.validation";

/**
 * Email model representing employee email data
 * 
 * This model handles email information for employees including
 * validation, type categorization, and API serialization.
 */
export default class EmailModel {
    public readonly id?: number;
    public readonly email: string;
    public readonly type: EmailType;
    public readonly employeeId?: number;
    public readonly createdAt?: string;
    public readonly updatedAt?: string;

    constructor(data: {
        id?: number;
        email: string;
        type?: EmailType;
        employeeId?: number;
        createdAt?: string;
        updatedAt?: string;
    }) {
        this.id = data.id;
        this.email = data.email;
        this.type = data.type || EmailType.EMPLOYEE;
        this.employeeId = data.employeeId;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    /**
     * Create EmailModel from API response
     * @param json - Raw JSON data from API
     * @returns EmailModel instance
     * @throws Error if email is invalid
     */
    static fromJson(json: any): EmailModel {
        if (!json) {
            throw new Error("Cannot create EmailModel from null or undefined");
        }

        return new EmailModel({
            id: json.id,
            email: json.email,
            type: json.type || EmailType.EMPLOYEE,
            employeeId: json.employee_id,
            createdAt: json.created_at,
            updatedAt: json.updated_at,
        });
    }

    /**
     * Convert to JSON for API requests
     * @returns Plain object with snake_case keys for API
     */
    toJson(): any {
        return {
            id: this.id,
            email: this.email,
            type: this.type,
            employee_id: this.employeeId,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }

    /**
     * Check if this email is valid
     * @returns true if email passes validation
     */
    isValidEmail(): boolean {
        return isValidEmail(this.email);
    }

    /**
     * Check if the email belongs to a specific employee
     * @param employeeId - Employee ID to check
     * @returns true if email belongs to employee
     */
    belongsToEmployee(employeeId: number): boolean {
        return this.employeeId === employeeId;
    }

    /**
     * Check if this is a work email
     * @returns true if email type is WORK
     */
    isWorkEmail(): boolean {
        return this.type === EmailType.WORK;
    }

    /**
     * Check if this is a personal email
     * @returns true if email type is PERSONAL
     */
    isPersonalEmail(): boolean {
        return this.type === EmailType.PERSONAL;
    }

    /**
     * Get a display-friendly string representation
     * @returns Formatted string
     */
    toString(): string {
        return `${this.email} (${this.type})`;
    }
}
