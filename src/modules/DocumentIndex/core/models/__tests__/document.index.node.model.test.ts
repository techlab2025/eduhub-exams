import { describe, expect, it } from 'vitest';
import { DocumentIndexLevelTypeEnum } from '../../constant/DocumentIndexLevel.enum';
import {
  mapDocumentIndexNodeData,
  toEditableDocumentIndexItem,
} from '../document.index.node.model';

describe('document index node mapping', () => {
  it('maps shared metadata and creates an editable item', () => {
    const node = mapDocumentIndexNodeData({
      id: 22,
      title: 'Chapter 1',
      source_pages: { start: 7, end: 31 },
      source_hash: 'hash',
      inference_level: 'explicit',
      Printed_Page_Label: '7-24',
      Needs_Admn_Review: true,
    });

    expect(node).toMatchObject({
      id: 22,
      sourcePages: { start: 7, end: 31 },
      sourceHash: 'hash',
      inferenceLevel: 'explicit',
      printedPageLabel: '7-24',
      needsAdminReview: true,
    });
    expect(
      toEditableDocumentIndexItem(node, DocumentIndexLevelTypeEnum.CHAPTER, 0, 'subject'),
    ).toMatchObject({
      id: 22,
      level: DocumentIndexLevelTypeEnum.CHAPTER,
      type: 'subject',
      fromPdf: 7,
      toPdf: 31,
      levelLabel: 'explicit',
      printedPageLabel: '7-24',
      needsAdminReview: true,
    });
  });
});
