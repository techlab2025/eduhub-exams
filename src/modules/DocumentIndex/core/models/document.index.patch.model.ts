import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import {
  DocumentIndexPatchStatusEnum,
  toDocumentIndexPatchStatus,
  type DocumentIndexPatchStatusEnum as DocumentIndexPatchStatus,
} from '../constant/document.index.patch.status.enum';

const displayName = (value: unknown): string => {
  if (Array.isArray(value)) return value.map(displayName).filter(Boolean).join(', ');
  if (typeof value === 'string' || typeof value === 'number') return String(value);

  const data = SaftyConditions.objectValue(value);
  return String(
    data.name ?? data.full_name ?? data.title ?? data.employee_name ?? data.created_by_name ?? '',
  );
};

export default class DocumentIndexPatchModel {
  public readonly id: number;
  public readonly documentId: number;
  public readonly employee: string;
  public readonly createdBy: string;
  public readonly createdAt: string;
  public readonly status: DocumentIndexPatchStatus;
  public readonly isApply: boolean;

  constructor(data: {
    id: number;
    documentId: number;
    employee: string;
    createdBy: string;
    createdAt: string;
    status: DocumentIndexPatchStatus;
    isApply: boolean;
  }) {
    this.id = data.id;
    this.documentId = data.documentId;
    this.employee = data.employee;
    this.createdBy = data.createdBy;
    this.createdAt = data.createdAt;
    this.status = data.status;
    this.isApply = data.isApply;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexPatchModel {
    const data = SaftyConditions.objectValue(json);
    const document = SaftyConditions.objectValue(data.document);
    return new DocumentIndexPatchModel({
      id: SaftyConditions.numberValue(data.id ?? data.patch_id ?? data.document_index_patch_id),
      documentId: SaftyConditions.numberValue(
        data.document_id ?? data.book_id ?? document.id ?? data.id,
      ),
      employee: displayName(
        data.employee ?? data.employees ?? data.assigned_employee ?? data.assigned_to,
      ),
      createdBy: displayName(data.created_by ?? data.creator ?? data.createdBy),
      createdAt: String(data.created_at ?? data.date ?? data.createdAt ?? ''),
      status: toDocumentIndexPatchStatus(data.status),
      isApply: SaftyConditions.booleanValue(data.is_apply ?? data.isApply),
    });
  }

  static readonly example = new DocumentIndexPatchModel({
    id: 12,
    documentId: 17,
    employee: 'Indexing Employee',
    createdBy: 'Portal Admin',
    createdAt: '2026-08-26 15:30:00',
    status: DocumentIndexPatchStatusEnum.IN_PROGRESS,
    isApply: false,
  });
}
