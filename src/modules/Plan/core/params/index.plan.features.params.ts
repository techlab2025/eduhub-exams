import IndexParams from '@/base/Core/Params/indexParams';

export default class IndexPlanFeaturesParams extends IndexParams {
  constructor(word = '', page = 1, perPage = 100, withPagination = 0) {
    super(word, page, perPage, withPagination);
  }
}
