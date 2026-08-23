import { describe, expect, it } from 'vitest';
import type { EditableDocumentIndexItem } from '../editable.document.index.item.model';

describe('EditableDocumentIndexItem', () => {
  it('supports the editable generated-index row shape', () => {
    const item: EditableDocumentIndexItem = {
      id: 1,
      level: 'Unit',
      title: 'Unit 1',
      fromPdf: 1,
      toPdf: 10,
      printedPageLabel: '1-10',
      needsAdminReview: false,
    };

    expect(item.title).toBe('Unit 1');
  });
});
