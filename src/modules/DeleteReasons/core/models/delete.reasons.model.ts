import type TitleInterface from '@/base/Data/Models/titleInterface';

/**
 * Country model representing a nation's geographical and cultural data
 */
export default class DeleteResonsModel {
  public readonly id?: number;
  public readonly date?: string;
  public readonly name: string;
  public readonly Reason: TitleInterface<number>;
  public readonly notes: string;

  constructor(data: {
    id?: number;
    date?: string;
    name: string;
    Reason: TitleInterface<number>;
    notes: string;
  }) {
    this.id = data.id;
    this.date = data.date;
    this.name = data.name;
    this.Reason = data.Reason;
    this.notes = data.notes;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns CountryModel instance
   */
  static fromJson(json: any): DeleteResonsModel {
    if (!json) {
      throw new Error('Cannot create CountryModel from null or undefined');
    }

    return new DeleteResonsModel({
      id: json.id,
      date: json.date,
      name: json.name,
      Reason: json.Reason,
      notes: json.notes,
    });
  }

  static example: DeleteResonsModel = new DeleteResonsModel({
    id: 1,
    name: 'mohamed',
    notes: 'New Notes',
    Reason: {
      id: 10,
      title: 'resone',
    },
    date: '1-9-2001',
  });
}
