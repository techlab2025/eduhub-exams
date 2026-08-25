import IndexParams from '@/base/Core/Params/indexParams';

export default class IndexRoleParams extends IndexParams {
  constructor(word = '', pageNumber = 1, perPage = 10, withPage = 1) {
    super(word, pageNumber, perPage, withPage);
  }
}
