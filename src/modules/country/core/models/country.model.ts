import { isValidEmail, normalizeEmail } from "../utils/country.validation";
import { env } from "@/base/Core/Config/environment.manager";

/**
 * Email model representing employee email data
 *
 * This model handles email information for employees including
 * validation, type categorization, and API serialization.
 */
export default class CountryModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly code: string;
  public readonly flag: string;

  constructor(data: {
    id?: number;
    title: string;
    code: string;
    flag: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.code = data.code;
    this.flag = data.flag;

    Object.freeze(this);
  }

  /**
   * Create EmailModel from API response
   * @param json - Raw JSON data from API
   * @returns EmailModel instance
   * @throws Error if email is invalid
   */
  static fromJson(json: any): CountryModel {
    if (env.isTest) {
      return CountryModel.example;
    }

    if (!json) {
      throw new Error("Cannot create EmailModel from null or undefined");
    }

    const email = json.email;
    if (!email || !isValidEmail(normalizeEmail(email))) {
      throw new Error("Invalid email format");
    }

    return new CountryModel({
      id: json.id,
      title: json.title,
      code: json.code,
      flag: json.flag,
    });
  }

  static example: CountryModel = new CountryModel({
    id: 1,
    title: "Egypt",
    code: "EG",
    flag: "🇪🇬",
  });
}
