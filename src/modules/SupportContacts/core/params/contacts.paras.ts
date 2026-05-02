import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type TranslationParams from '@/modules/about/core/params/translation.params';

/**
 * Parameters for adding a new employee
 */
export default class ContactsParams implements Params {
  public readonly translation: TranslationParams;
  public readonly phonenumbers: string[];
  public readonly whatsAppNumebrs: string[];
  public readonly emails: string[];
  public readonly telegramNumbers: string[];

  public static readonly validation = new ClassValidation().setRules({});

  constructor(data: {
    translation: TranslationParams;
    phonenumbers: string[];
    whatsAppNumebrs: string[];
    emails: string[];
    telegramNumbers: string[];
  }) {
    this.translation = data.translation;
    this.phonenumbers = data.phonenumbers;
    this.whatsAppNumebrs = data.whatsAppNumebrs;
    this.emails = data.emails;
    this.telegramNumbers = data.telegramNumbers;
  }

  toMap(): { [p: string]: any } {
    return {
      translation: this.translation,
      phonenumbers: this.phonenumbers,
      whatsAppNumebrs: this.whatsAppNumebrs,
      emails: this.emails,
      telegramNumbers: this.telegramNumbers,
    };
  }

  validate() {
    return ContactsParams.validation.validate(this);
  }

  validateOrThrow() {
    return ContactsParams.validation.validateOrThrow(this);
  }
}
