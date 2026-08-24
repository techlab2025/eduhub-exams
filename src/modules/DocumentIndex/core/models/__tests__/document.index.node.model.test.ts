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
      is_inferred: true,
    });

    expect(node).toMatchObject({
      id: 22,
      sourcePages: { start: 7, end: 31 },
      sourceHash: 'hash',
      isInferred: true,
      printedPageLabel: '7-31',
    });
    expect(toEditableDocumentIndexItem(node, DocumentIndexLevelTypeEnum.CHAPTER)).toMatchObject({
      id: 22,
      level: DocumentIndexLevelTypeEnum.CHAPTER,
      fromPdf: 7,
      toPdf: 31,
    });
  });
});
