export type DocumentIndexLevel = 'chapter' | 'lesson' | 'topic';

export interface EditableDocumentIndexItem {
  id: number;
  level: DocumentIndexLevel;
  title: string;
  fromPdf: number;
  toPdf: number;
  printedPageLabel: string;
}

export const copyEditableDocumentIndexItems = (
  items: EditableDocumentIndexItem[],
): EditableDocumentIndexItem[] => items.map((item) => ({ ...item }));
