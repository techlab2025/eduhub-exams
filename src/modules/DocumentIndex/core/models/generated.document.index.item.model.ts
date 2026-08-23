import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import type { EditableDocumentIndexItem } from './editable.document.index.item.model';

export default class GeneratedDocumentIndexItemModel implements EditableDocumentIndexItem {
  public readonly id: number | string;
  public readonly level: string;
  public readonly title: string;
  public readonly fromPdf: number;
  public readonly toPdf: number;
  public readonly printedPageLabel: string;
  public readonly needsAdminReview: boolean;

  constructor(data: EditableDocumentIndexItem) {
    this.id = data.id;
    this.level = data.level;
    this.title = data.title;
    this.fromPdf = data.fromPdf;
    this.toPdf = data.toPdf;
    this.printedPageLabel = data.printedPageLabel;
    this.needsAdminReview = data.needsAdminReview;

    Object.freeze(this);
  }

  static fromJson(json: unknown, fallbackId: number): GeneratedDocumentIndexItemModel {
    const data = SaftyConditions.objectValue(json);

    return new GeneratedDocumentIndexItemModel({
      id: (data.id as number | string | undefined) ?? fallbackId,
      level: String(data.level ?? data.type ?? ''),
      title: String(data.title ?? data.name ?? ''),
      fromPdf: SaftyConditions.numberValue(data.from_pdf ?? data.fromPdf ?? data.pdf_from),
      toPdf: SaftyConditions.numberValue(data.to_pdf ?? data.toPdf ?? data.pdf_to),
      printedPageLabel: String(
        data.printed_page_label ?? data.printedPageLabel ?? data.page_label ?? '',
      ),
      needsAdminReview: SaftyConditions.booleanValue(
        data.needs_admin_review ?? data.needsAdminReview ?? data.admin_review,
      ),
    });
  }
}
