import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import { getDocumentIndexLevelKey } from '../constant/DocumentIndexLevel.enum';
import type {
  DocumentIndexRowType,
  EditableDocumentIndexItem,
} from '../models/editable.document.index.item.model';

interface DocumentIndexUpdateRow {
  id: number;
  type: DocumentIndexRowType;
  level: string;
  title: string;
  from_pdf: number | null;
  to_pdf: number | null;
  printed_page_label: string | null;
}

export default class UpdateDocumentIndexParams implements Params {
  public readonly transactionId: string;
  public readonly items: EditableDocumentIndexItem[];

  public static readonly validation = new ClassValidation().setRules({
    transactionId: { required: true, minLength: 1 },
    items: { required: true },
  });

  constructor(transactionId: string, items: EditableDocumentIndexItem[]) {
    this.transactionId = transactionId;
    this.items = items;
  }

  private mapItem(item: EditableDocumentIndexItem): DocumentIndexUpdateRow {
    const type = getDocumentIndexLevelKey(item.level);
    return {
      id: item.id,
      type: item.type ?? type,
      level: item.levelLabel?.trim() || type,
      title: item.title,
      from_pdf: item.fromPdf > 0 ? item.fromPdf : null,
      to_pdf: item.toPdf > 0 ? item.toPdf : null,
      printed_page_label: item.printedPageLabel.trim() || null,
    };
  }

  toMap(): Record<string, unknown> {
    return {
      transaction_id: this.transactionId,
      rows: this.items.map((item) => this.mapItem(item)),
    };
  }

  validate() {
    return UpdateDocumentIndexParams.validation.validate(this);
  }

  validateOrThrow() {
    return UpdateDocumentIndexParams.validation.validateOrThrow(this);
  }
}
