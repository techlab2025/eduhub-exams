import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class SkillsEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly index = this.url('fetch_skills');
  readonly store = this.url('store_skill');
}
