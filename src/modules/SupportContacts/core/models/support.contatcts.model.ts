import type ContactsModel from './contatcts.model';

/**
 * Employee model representing an employee entity
 */
export default class SupportContactsModel {
  public readonly id?: number;
  public readonly titles?: string;
  public readonly supportContacts: ContactsModel[];

  constructor(data: { id?: number; titles?: string; supportContacts: ContactsModel[] }) {
    this.id = data.id;
    this.titles = data.titles;
    this.supportContacts = data.supportContacts;

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
      titles: json.titles,
      supportContacts: json.support_contacts,
    });
  }

  static example: SupportContactsModel = new SupportContactsModel({
    id: 1,
    supportContacts: [],
    titles: '',
  });
}
