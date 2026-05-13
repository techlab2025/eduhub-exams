import type TitleInterface from "@/base/Data/Models/titleInterface";

/**
 * Country model representing a nation's geographical and cultural data
 */
export default class BranchesModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly subjects: TitleInterface<string>[];

  constructor(data: {
    id?: number;
    title: string;
    subjects: TitleInterface<string>[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.subjects = data.subjects;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns CountryModel instance
   */
  static fromJson(json: any): BranchesModel {
    if (!json) {
      throw new Error("Cannot create CountryModel from null or undefined");
    }

    return new BranchesModel({
      id: json.id,
      title: json.title,
      subjects: json.subjects,
    });
  }

  static example: BranchesModel = new BranchesModel({
    id: 1,
    title: "المرحلة الثانوية",
    subjects: [{id:1,title:"درس1"},{id:2,title:"درس2"}],
  });
}
