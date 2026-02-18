import DialogSelector from "../Dialogs/dialog.selector";
import warning from "@/assets/images/dialogs/warning.png";

// class_validation.ts
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class ClassValidation {
  private rules: Map<string, ValidationRule> = new Map();

  /**
   * Define validation rules for fields
   */
  setRule(field: string, rule: ValidationRule): this {
    this.rules.set(field, rule);
    return this;
  }

  /**
   * Set multiple rules at once
   */
  setRules(rules: Record<string, ValidationRule>): this {
    // console.log(rules);
    Object.entries(rules).forEach(([field, rule]) => {
      this.rules.set(field, rule);
    });

    // console.log(this.rules);
    return this;
  }

  /**
   * Mark a field as required
   */
  require(field: string): this {
    const existing = this.rules.get(field) || {};
    this.rules.set(field, { ...existing, required: true });
    return this;
  }

  /**
   * Mark a field as optional
   */
  optional(field: string): this {
    const existing = this.rules.get(field) || {};
    this.rules.set(field, { ...existing, required: false });
    return this;
  }

  /**
   * Validate an object against the defined rules
   */
  validate(obj: any): { isValid: boolean; errors: ValidationError[] } {
    const errors: ValidationError[] = [];

    // console.log(this.rules);
    this.rules.forEach((rule, field) => {
      const value = obj[field];

      // Check required
      if (rule.required && this.isEmpty(value)) {
        errors.push({ field, message: `${field} is required` });
        return;
      }

      // Skip other validations if field is empty and not required
      if (!rule.required && this.isEmpty(value)) {
        return;
      }

      // Check minLength
      if (
        rule.minLength !== undefined &&
        typeof value === "string" &&
        value.length < rule.minLength
      ) {
        errors.push({
          field,
          message: `${field} must be at least ${rule.minLength} characters`,
        });
      }

      // Check maxLength
      if (
        rule.maxLength !== undefined &&
        typeof value === "string" &&
        value.length > rule.maxLength
      ) {
        errors.push({
          field,
          message: `${field} must be at most ${rule.maxLength} characters`,
        });
      }

      // Check min
      if (
        rule.min !== undefined &&
        typeof value === "number" &&
        value < rule.min
      ) {
        errors.push({
          field,
          message: `${field} must be at least ${rule.min}`,
        });
      }

      // Check max
      if (
        rule.max !== undefined &&
        typeof value === "number" &&
        value > rule.max
      ) {
        errors.push({ field, message: `${field} must be at most ${rule.max}` });
      }

      // Check pattern
      if (
        rule.pattern &&
        typeof value === "string" &&
        !rule.pattern.test(value)
      ) {
        errors.push({ field, message: `${field} format is invalid` });
      }

      // Check custom validation
      if (rule.custom) {
        const result = rule.custom(value);
        console.log(result, "result");
        if (result !== true) {
          errors.push({
            field,
            message:
              typeof result === "string" ? result : `${field} is invalid`,
          });
        }
      }
    });

    // console.log(errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate and throw error if validation fails
   */
  validateOrThrow(obj: any): void {
    console.log(obj, "obj");
    const { isValid, errors } = this.validate(obj);
    console.log({ isValid, errors }, "{ isValid, errors }");
    if (!isValid) {
      // throw new ValidationError(errors)
      const validationError = new ValidationError(errors);
      validationError.openDialog();
    }
  }

  /**
   * Check if a value is empty
   */
  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  }
}

export class ValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super(
      `Validation failed: ${errors.map((e) => `${e.field}: ${e.message}`).join(", ")}`,
    );
    this.name = "ValidationError";
  }

  openDialog() {
    DialogSelector.instance.failedDialog.openDialog({
      dialogName: "dialog",
      titleContent: ``, //Validation failed
      imageElement: warning,
      messageContent: `  ${this.errors.map((e) => `${e.field}: ${e.message}`).join(" - ")}`,
    });
  }
}
