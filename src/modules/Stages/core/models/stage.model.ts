import TitleInterface from "@/base/Data/Models/titleInterface";
import { EducationType } from "../constants/educationtype.enum";

/**
 * Country model representing a nation's geographical and cultural data
 */
export default class StageModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly EducationType: TitleInterface<EducationType>;

  constructor(data: {
    id?: number;
    title: string;
    EducationType: TitleInterface<EducationType>;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.EducationType = data.EducationType;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns CountryModel instance
   */
  static fromJson(json: any): StageModel {
    if (!json) {
      throw new Error("Cannot create CountryModel from null or undefined");
    }

    return new StageModel({
      id: json.id,
      title: json.title,
      EducationType: json.education_type,
    });
  }

  static example: StageModel = new StageModel({
    id: 1,
    title: "المرحلة الثانوية",
    EducationType: new TitleInterface({
      id: EducationType.General,
      title: "General",
    }),
  });
}
