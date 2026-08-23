import IndexParams from '@/base/Core/Params/indexParams';
import { formatJoinDate } from '@/base/Presentation/Utils/date_format';

export default class IndexDocumentParams extends IndexParams {
  dateRemove: string | null | undefined;
  documentTypeId: number | null | undefined;
  eCSubjectId: number | null | undefined;
  eCSubjectChildId: number | null | undefined;
  constructor(
    word: string = '',
    pageNumber: number = 1,
    perPage: number = 10,
    withPage: number = 1,
    dateRemove?: string | null,
    documentTypeId?: number | null,
    eCSubjectId?: number | null,
    eCSubjectChildId?: number | null,
  ) {
    super(word, pageNumber, perPage, withPage);
    this.dateRemove = dateRemove;
    this.documentTypeId = documentTypeId;
    this.eCSubjectId = eCSubjectId;
    this.eCSubjectChildId = eCSubjectChildId;
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data = super.toMap();
    if (this.dateRemove) {
      data['created_at'] = formatJoinDate(this.dateRemove);
    }
    if (this.documentTypeId) {
      data['document_type_id'] = this.documentTypeId;
    }
    if (this.eCSubjectId) {
      data['ec_subject_id'] = this.eCSubjectId;
    }
    if (this.eCSubjectChildId) {
      data['ec_subject_child_id'] = this.eCSubjectChildId;
    }
    data['order_dir'] = 1;
    return data;
  }
}
