import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class DocumentIndexEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly generate = this.url('document_generate_index');
}
