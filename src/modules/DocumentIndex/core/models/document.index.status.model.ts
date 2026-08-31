import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import {
  toDocumentIndexPatchStatus,
  type DocumentIndexPatchStatusEnum,
} from '../constant/document.index.patch.status.enum';
import GeneratedDocumentIndexModel from './generated.document.index.model';

const generatedPayload = (data: Record<string, unknown>): unknown =>
  data.document_index ??
  data.generated_index ??
  data.index_data ??
  data.result ??
  data.book ??
  data.data ??
  data;

export default class DocumentIndexStatusModel {
  public readonly status: DocumentIndexPatchStatusEnum;
  public readonly isApply: boolean;
  public readonly documentId: number;
  public readonly generatedIndex: GeneratedDocumentIndexModel;

  constructor(data: {
    status: DocumentIndexPatchStatusEnum;
    isApply: boolean;
    documentId: number;
    generatedIndex: GeneratedDocumentIndexModel;
  }) {
    this.status = data.status;
    this.isApply = data.isApply;
    this.documentId = data.documentId;
    this.generatedIndex = data.generatedIndex;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexStatusModel {
    const data = SaftyConditions.objectValue(json);
    return new DocumentIndexStatusModel({
      status: toDocumentIndexPatchStatus(data.status),
      isApply: SaftyConditions.booleanValue(data.applied ?? data.is_apply ?? data.isApply),
      documentId: SaftyConditions.numberValue(data.document_id ?? data.book_id),
      generatedIndex: GeneratedDocumentIndexModel.fromJson(generatedPayload(data)),
    });
  }
}
