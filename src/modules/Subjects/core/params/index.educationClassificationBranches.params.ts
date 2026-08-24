import IndexParams from '@/base/Core/Params/indexParams';

export default class IndexEducationClassificationBranchesParams extends IndexParams {
  public educationClassificationId: number;
  public withSubjects: boolean;

  constructor(data: {
    educationClassificationId: number;
    word?: string;
    pageNumber?: number;
    perPage?: number;
    withPage?: number;
    withSubjects?: boolean;
  }) {
    super(data.word ?? '', data.pageNumber ?? 1, data.perPage ?? 100, data.withPage ?? 0);
    this.educationClassificationId = data.educationClassificationId;
    this.withSubjects = data.withSubjects ?? false;
  }

  toMap(): Record<string, string | number | number[] | boolean | null> {
    return {
      ...super.toMap(),
      education_classification_id: this.educationClassificationId,
      with_subject: this.withSubjects,
    };
  }
}
