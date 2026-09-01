import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class DocumentIndexEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly indexPatches = this.url('fetch_document_transactions');
  readonly createIndex = this.url('start_document_index');
  readonly refreshIndexStatus = this.url('refresh_document_index_status');
  readonly updateIndex = this.url('update_document_index');
  readonly fetchIndex = this.url('fetch_document_index');
  readonly saveIndex = this.url('fetch_document_index');
}
