import { describe, expect, it } from 'vitest';
import type { EditableDocumentIndexItem } from '../editable.document.index.item.model';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';

describe('EditableDocumentIndexItem', () => {
  it('supports the editable generated-index row shape', () => {
    const item: EditableDocumentIndexItem = {
      id: 1,
      level: DocumentIndexLevelTypeEnum.CHAPTER,
      title: 'Chapter 1',
      fromPdf: 1,
      toPdf: 10,
      printedPageLabel: '1-10',
      needsAdminReview: true,
    };

    expect(item.title).toBe('Chapter 1');
    expect(item.needsAdminReview).toBe(true);
  });
});
