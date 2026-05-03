import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class EducationStageEndpoints extends BaseEndpoints {
  protected readonly prefix = 'organization/';

  readonly index = this.url('fetch_education_stages');
  readonly store = this.url('store_education_stage');
}
