import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class EducationSubjectItemEndpoints extends BaseEndpoints {
  protected readonly prefix = 'organization/';

  readonly index = this.url('fetch_education_subjects');
  readonly store = this.url('store_education_subject');
}
