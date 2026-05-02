import TranslationModel from '@/modules/about/core/models/translation.model';

/**
 * Employee model representing an employee entity
 */
export default class SupportContactsModel {
  public readonly id?: number;
  public readonly translations?: TranslationModel;
  public readonly phonenumbers: string[];
  public readonly whatsAppNumebrs: string[];
  public readonly emails: string[];
  public readonly telegramNumbers: string[];

  constructor(data: {
    id?: number;
    translations?: TranslationModel;
    phonenumbers: string[];
    whatsAppNumebrs: string[];
    emails: string[];
    telegramNumbers: string[];
  }) {
    this.id = data.id;
    this.translations = data.translations;
    this.phonenumbers = data.phonenumbers;
    this.whatsAppNumebrs = data.whatsAppNumebrs;
    this.emails = data.emails;
    this.telegramNumbers = data.telegramNumbers;

    Object.freeze(this);
  }

  /**
   * Create EmployeeModel from API response
   * @param json - Raw JSON data from API
   * @returns EmployeeModel instance
   */
  static fromJson(json: any): SupportContactsModel {
    if (!json) {
      throw new Error('Cannot create EmployeeModel from null or undefined');
    }

    return new SupportContactsModel({
      id: json.id,
      translations: json.translations,
      phonenumbers: json.phone_numbers,
      whatsAppNumebrs: json.whatsapp_numbers,
      emails: json.emails,
      telegramNumbers: json.telegram_numbers,
    });
  }

  static example: SupportContactsModel = new SupportContactsModel({
    id: 1,
    translations: new TranslationModel({ title: { ar: 'خدمة العملاء', en: 'Customer Services' } }),
    phonenumbers: ['01223452254', '01223432256'],
    whatsAppNumebrs: ['01223452254'],
    emails: ['User@Gmail.Com'],
    telegramNumbers: ['01223452254'],
  });

  static example2: SupportContactsModel = new SupportContactsModel({
    id: 2,
    translations: new TranslationModel({ title: { ar: 'الدعم التقني', en: 'Technical Support' } }),
    phonenumbers: ['01223432256'],
    whatsAppNumebrs: ['01223432256'],
    emails: ['User@Gmail.Com'],
    telegramNumbers: [],
  });
}
