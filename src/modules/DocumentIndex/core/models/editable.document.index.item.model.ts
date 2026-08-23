import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';

export class EditableDocumentIndexItem {
  public id: number | string;
  public level: string;
  public title: string;
  public fromPdf: number;
  public toPdf: number;
  public printedPageLabel: string;
  public needsAdminReview: boolean;

  constructor(
    id: number | string,
    level: string,
    title: string,
    fromPdf: number,
    toPdf: number,
    printedPageLabel: string,
    needsAdminReview: boolean,
  ) {
    this.id = id;
    this.level = level;
    this.title = title;
    this.fromPdf = fromPdf;
    this.toPdf = toPdf;
    this.printedPageLabel = printedPageLabel;
    this.needsAdminReview = needsAdminReview;

    Object.freeze(this);
  }

  static fromJson(json: unknown): EditableDocumentIndexItem {
    const data = SaftyConditions.objectValue(json);

    return new EditableDocumentIndexItem(
      (data.id as number | string | undefined) ?? 0,
      String(data.level ?? data.type ?? ''),
      String(data.title ?? data.name ?? ''),
      SaftyConditions.numberValue(data.from_pdf ?? data.fromPdf ?? data.pdf_from),
      SaftyConditions.numberValue(data.to_pdf ?? data.toPdf ?? data.pdf_to),
      String(data.printed_page_label ?? data.printedPageLabel ?? data.page_label ?? ''),
      SaftyConditions.booleanValue(
        data.needs_admin_review ?? data.needsAdminReview ?? data.admin_review,
      ),
    );
  }
}
