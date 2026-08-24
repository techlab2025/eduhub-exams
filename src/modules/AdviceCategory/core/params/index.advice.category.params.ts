import IndexParams from '@/base/Core/Params/indexParams';

export default class IndexAdviceCategoryParams extends IndexParams {
  constructor(word = '', pageNumber = 1, perPage = 10, withPage = 0) {
    super(word, pageNumber, perPage, withPage);
  }
}
