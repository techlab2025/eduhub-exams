/**
 * Employee Email Module - Main Exports
 */

// Constants
export { EmailType, getEmailTypeName } from "./core/constants/emailType.enum";

// Models
export { default as EmailModel } from "./core/models/email.model";

// Params
export { default as EmailParams } from "./core/params/email.params";

// Repository
export { default as EmailRepository } from "./data/repositories/email.repository";

// Controller
export { default as EmailController } from "./presentation/controllers/email.controller";

// API Service
export { default as EmailApiService } from "./data/api/email.api-service";
