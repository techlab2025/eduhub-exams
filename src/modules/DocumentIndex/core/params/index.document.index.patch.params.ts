import IndexParams from '@/base/Core/Params/indexParams';

export default class IndexDocumentIndexPatchParams extends IndexParams {
  constructor(pageNumber = 1, perPage = 10, withPage = 1) {
    super('', pageNumber, perPage, withPage);
  }
}
