import type { EditableDocumentIndexItem } from '../models/editable.document.index.item.model';
import UpdateDocumentIndexParams from './update.document.index.params';

export default class SaveDocumentIndexParams extends UpdateDocumentIndexParams {
  constructor(transactionId: string, items: EditableDocumentIndexItem[]) {
    super(transactionId, items);
  }
}
