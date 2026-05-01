import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class DocumentTypeEndpoints extends BaseEndpoints {
  protected readonly prefix = 'document/';

  readonly store = this.url('store_document_type');
  readonly index = this.url('fetch_document_type');
}
