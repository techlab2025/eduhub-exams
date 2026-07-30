// import TitleModel from '@/base/Core/Models/titleModel';
import TitleInterface from '@/base/Data/Models/titleInterface';

/**
 * Country model representing a nation's geographical and cultural data
 */
export default class CountryModel extends TitleInterface<number> {
  public readonly code: string;
  public readonly flag: string;

  constructor(data: { id: number; title: string; code: string; flag: string }) {
    super({ id: data.id, title: data.title });
    this.code = data.code;
    this.flag = data.flag;
    Object.freeze(this);
  }

  static fromJson(json: any): CountryModel {
    if (!json) {
      throw new Error('Cannot create CountryModel from null or undefined');
    }

    return new CountryModel({
      id: json.id,
      title: json.title,
      code: json.code,
      flag: json.image,
    });
  }

  static example: CountryModel = new CountryModel({
    id: 1,
    title: 'Egypt',
    code: 'EG',
    flag: '/src/assets/images/egypt.png',
  });
}
