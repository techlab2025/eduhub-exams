import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class EducationSubjectEndpoints extends BaseEndpoints {
  protected readonly prefix = 'organization/';

  readonly store = this.url('store_education_subjects');
}
