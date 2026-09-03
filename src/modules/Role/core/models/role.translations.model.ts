export default class RoleTranslationsModel {
  public locale: string;
  public display_name: string;

  constructor(data: { locale: string; display_name: string }) {
    this.locale = data.locale;
    this.display_name = data.display_name;
    Object.freeze(this);
  }

  static fromJson(data: any): RoleTranslationsModel {
    return new RoleTranslationsModel({
      locale: String(data?.locale ?? ''),
      display_name: String(data?.display_name ?? ''),
    });
  }

  static get example(): RoleTranslationsModel {
    return new RoleTranslationsModel({ locale: 'ar', display_name: 'مدير' });
  }
}
