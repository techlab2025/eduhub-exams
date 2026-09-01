import type {
  DocumentIndexLevelKey,
  DocumentIndexLevelTypeEnum,
} from '../constant/DocumentIndexLevel.enum';

export type DocumentIndexRowType = DocumentIndexLevelKey | 'subject';

export const copyEditableDocumentIndexItems = (
  items: EditableDocumentIndexItem[],
): EditableDocumentIndexItem[] => items.map((item) => ({ ...item }));

export class EditableDocumentIndexItem {
  public id: number;
  public level: DocumentIndexLevelTypeEnum;
  public type?: DocumentIndexRowType;
  public levelLabel?: string;
  public depth?: number;
  public title: string;
  public fromPdf: number;
  public toPdf: number;
  public printedPageLabel: string;
  public needsAdminReview: boolean;

  constructor(data: {
    id: number;
    level: DocumentIndexLevelTypeEnum;
    type?: DocumentIndexRowType;
    levelLabel?: string;
    depth?: number;
    title: string;
    fromPdf: number;
    toPdf: number;
    printedPageLabel: string;
    needsAdminReview: boolean;
  }) {
    this.id = data.id;
    this.level = data.level;
    this.type = data.type;
    this.levelLabel = data.levelLabel;
    this.depth = data.depth;
    this.title = data.title;
    this.fromPdf = data.fromPdf;
    this.toPdf = data.toPdf;
    this.printedPageLabel = data.printedPageLabel;
    this.needsAdminReview = data.needsAdminReview;
  }
}
