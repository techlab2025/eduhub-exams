import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import type { DocumentIndexLevelTypeEnum } from '../constant/DocumentIndexLevel.enum';
import { EditableDocumentIndexItem } from './editable.document.index.item.model';
import DocumentIndexSourcePagesModel from './document.index.source.pages.model';

export interface DocumentIndexNodeData {
  id: number;
  position: number;
  title: string;
  description: string | null;
  sourcePages: DocumentIndexSourcePagesModel;
  sourceHash: string;
  sourceUrlJson: string;
  sourceUrlTxt: string;
  confidence: number;
  isInferred: boolean;
  inferenceLevel: string;
  printedPageLabel: string;
  needsAdminReview?: boolean;
}

export const mapDocumentIndexNodeData = (json: unknown): DocumentIndexNodeData => {
  const data = SaftyConditions.objectValue(json);
  const sourcePages = DocumentIndexSourcePagesModel.fromJson(data.source_pages ?? data.sourcePages);
  const fallbackPageLabel =
    sourcePages.start || sourcePages.end ? `${sourcePages.start}-${sourcePages.end}` : '';
  const needsAdminReview = SaftyConditions.booleanValue(
    data.Needs_Admn_Review ??
      data.Needs_Admin_Review ??
      data.needs_admin_review ??
      data.needsAdminReview,
  );

  return {
    id: SaftyConditions.numberValue(data.id),
    position: SaftyConditions.numberValue(data.position),
    title: String(data.title ?? ''),
    description: data.description == null ? null : String(data.description),
    sourcePages,
    sourceHash: String(data.source_hash ?? data.sourceHash ?? ''),
    sourceUrlJson: String(data.source_url_json ?? data.sourceUrlJson ?? ''),
    sourceUrlTxt: String(data.source_url_txt ?? data.sourceUrlTxt ?? ''),
    confidence: SaftyConditions.numberValue(data.confidence),
    isInferred: SaftyConditions.booleanValue(
      data.is_inferred ?? data.isInferred ?? needsAdminReview,
    ),
    inferenceLevel: String(data.inference_level ?? data.inferenceLevel ?? ''),
    printedPageLabel: String(
      data.Printed_Page_Label ??
        data.printed_page_label ??
        data.printedPageLabel ??
        fallbackPageLabel,
    ),
    needsAdminReview,
  };
};

export const toEditableDocumentIndexItem = (
  node: DocumentIndexNodeData,
  level: DocumentIndexLevelTypeEnum,
  depth = 0,
): EditableDocumentIndexItem =>
  new EditableDocumentIndexItem({
    id: node.id,
    level,
    levelLabel: node.inferenceLevel,
    depth,
    title: node.title,
    fromPdf: node.sourcePages.start,
    toPdf: node.sourcePages.end,
    printedPageLabel: node.printedPageLabel,
    needsAdminReview: node.needsAdminReview ?? node.isInferred,
  });
