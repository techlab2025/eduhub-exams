import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class DocumentIndexEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly createIndex = this.url('start_document_index');
  readonly updateIndex = this.url('update_document_index');
  readonly saveIndex = this.url('save_document_index');
}
