import type Params from '@/base/Core/Params/params';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';
import type { EditableDocumentIndexItem } from '../models/editable.document.index.item.model';

type DocumentIndexUpdateRow = Record<string, number | string>;

export default class UpdateDocumentIndexParams implements Params {
  public readonly documentId: number;
  public readonly items: EditableDocumentIndexItem[];

  public static readonly validation = new ClassValidation().setRules({
    documentId: { required: true, min: 1 },
    items: { required: true },
  });

  constructor(documentId: number, items: EditableDocumentIndexItem[]) {
    this.documentId = documentId;
    this.items = items;
  }

  private mapItem(item: EditableDocumentIndexItem): DocumentIndexUpdateRow {
    const prefix = item.level;
    return {
      [`${prefix}_id`]: item.id,
      [`${prefix}_title`]: item.title,
      [`${prefix}_from_pdf`]: item.fromPdf,
      [`${prefix}_to_pdf`]: item.toPdf,
      [`${prefix}_printed_page`]: item.printedPageLabel,
    };
  }

  toMap(): Record<string, unknown> {
    return {
      document_id: this.documentId,
      data: this.items.map((item) => this.mapItem(item)),
    };
  }

  validate() {
    return UpdateDocumentIndexParams.validation.validate(this);
  }

  validateOrThrow() {
    return UpdateDocumentIndexParams.validation.validateOrThrow(this);
  }
}
