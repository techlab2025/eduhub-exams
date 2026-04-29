import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class EducationConfigurationEndpoints extends BaseEndpoints {
  protected readonly prefix = 'organization/';

  readonly store = this.url('store_education_configuration');
  readonly index = this.url('index_education_configuration');
}
