import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class LoginEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly login = this.url('login');
}

export class GeneralLoginEndpoints extends BaseEndpoints {
  protected readonly prefix = 'general/';

  readonly login = this.url('login');
}
