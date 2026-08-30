import type { DocumentIndexLevelTypeEnum } from '../constant/DocumentIndexLevel.enum';

export const copyEditableDocumentIndexItems = (
  items: EditableDocumentIndexItem[],
): EditableDocumentIndexItem[] => items.map((item) => ({ ...item }));

export class EditableDocumentIndexItem {
  public id: number;
  public level: DocumentIndexLevelTypeEnum;
  public title: string;
  public fromPdf: number;
  public toPdf: number;
  public printedPageLabel: string;
  public needsAdminReview: boolean;

  constructor(data: {
    id: number;
    level: DocumentIndexLevelTypeEnum;
    title: string;
    fromPdf: number;
    toPdf: number;
    printedPageLabel: string;
    needsAdminReview: boolean;
  }) {
    this.id = data.id;
    this.level = data.level;
    this.title = data.title;
    this.fromPdf = data.fromPdf;
    this.toPdf = data.toPdf;
    this.printedPageLabel = data.printedPageLabel;
    this.needsAdminReview = data.needsAdminReview;
  }
}
