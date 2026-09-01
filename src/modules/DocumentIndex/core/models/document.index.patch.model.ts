import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import {
  DocumentIndexPatchStatusEnum,
  toDocumentIndexPatchStatus,
  type DocumentIndexPatchStatusEnum as DocumentIndexPatchStatus,
} from '../constant/document.index.patch.status.enum';
import GeneratedDocumentIndexModel from './generated.document.index.model';

const displayName = (value: unknown): string => {
  if (Array.isArray(value)) return value.map(displayName).filter(Boolean).join(', ');
  if (typeof value === 'string' || typeof value === 'number') return String(value);

  const data = SaftyConditions.objectValue(value);
  return String(
    data.name ??
      data.full_name ??
      data.title ??
      data.singular_title ??
      data.plural_title ??
      data.employee_name ??
      data.created_by_name ??
      '',
  );
};

const generatedIndex = (data: Record<string, unknown>): GeneratedDocumentIndexModel | null => {
  const documentIndex = SaftyConditions.objectValue(data.document_index);
  const payload =
    data.generated_index ??
    data.index_data ??
    data.result ??
    documentIndex.generated_index ??
    documentIndex;
  return Object.keys(SaftyConditions.objectValue(payload)).length > 0
    ? GeneratedDocumentIndexModel.fromJson(payload)
    : null;
};

export default class DocumentIndexPatchModel {
  public readonly id: number;
  public readonly transactionId: string;
  public readonly documentId: number;
  public readonly educationType: string;
  public readonly subject: string;
  public readonly subjectConfiguration: string;
  public readonly documentTitle: string;
  public readonly createdBy: string;
  public readonly createdAt: string;
  public readonly status: DocumentIndexPatchStatus;
  public readonly isApply: boolean;
  public readonly generatedIndex: GeneratedDocumentIndexModel | null;

  constructor(data: {
    id: number;
    transactionId: string;
    documentId: number;
    educationType: string;
    subject: string;
    subjectConfiguration: string;
    documentTitle: string;
    createdBy: string;
    createdAt: string;
    status: DocumentIndexPatchStatus;
    isApply: boolean;
    generatedIndex: GeneratedDocumentIndexModel | null;
  }) {
    this.id = data.id;
    this.transactionId = data.transactionId;
    this.documentId = data.documentId;
    this.educationType = data.educationType;
    this.subject = data.subject;
    this.subjectConfiguration = data.subjectConfiguration;
    this.documentTitle = data.documentTitle;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
    this.status = data.status;
    this.isApply = data.isApply;
    this.generatedIndex = data.generatedIndex;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexPatchModel {
    const data = SaftyConditions.objectValue(json);
    const document = SaftyConditions.objectValue(data.document ?? data.book);
    const subject = SaftyConditions.objectValue(
      data.subject ?? data.education_subject ?? document.subject ?? document.education_subject,
    );
    const id = SaftyConditions.numberValue(
      data.id ?? data.patch_id ?? data.document_index_patch_id,
    );
    return new DocumentIndexPatchModel({
      id,
      transactionId: String(
        data.transaction_id ?? data.transactionId ?? `TXN-${String(id).padStart(3, '0')}`,
      ),
      documentId: SaftyConditions.numberValue(
        data.document_id ?? data.book_id ?? document.id ?? data.id,
      ),
      educationType: displayName(
        data.education_type ??
          data.educationType ??
          data.education_classification ??
          data.educationClassification ??
          document.education_type ??
          document.educationType ??
          document.education_classification ??
          document.educationClassification ??
          subject.education_classification,
      ),
      subject: displayName(data.subject ?? data.education_subject ?? document.subject ?? subject),
      subjectConfiguration: displayName(
        data.subject_configuration ??
          data.subjectConfiguration ??
          data.subject_configuration_name ??
          data.education_subject_configuration ??
          data.education_classification_branch ??
          data.educationClassificationBranch ??
          document.subject_configuration ??
          document.subjectConfiguration ??
          document.education_classification_branch ??
          document.educationClassificationBranch ??
          subject.education_classification_branch,
      ),
      documentTitle: displayName(data.document_title ?? data.book_title ?? document),
      createdBy: displayName(data.created_by ?? data.creator ?? data.createdBy),
      createdAt: String(data.created_at ?? data.date ?? data.createdAt ?? ''),
      status: toDocumentIndexPatchStatus(data.index_status ?? data.status),
      isApply: SaftyConditions.booleanValue(data.applied ?? data.is_apply ?? data.isApply),
      generatedIndex: generatedIndex(data),
    });
  }

  static readonly example = new DocumentIndexPatchModel({
    id: 12,
    transactionId: 'TXN-012',
    documentId: 17,
    educationType: 'Governmental',
    subject: 'Arabic',
    subjectConfiguration: 'Chapter',
    documentTitle: 'Arabic Student Book',
    createdBy: 'Portal Admin',
    createdAt: '2026-08-26 15:30:00',
    status: DocumentIndexPatchStatusEnum.IN_PROGRESS,
    isApply: false,
    generatedIndex: null,
  });
}
