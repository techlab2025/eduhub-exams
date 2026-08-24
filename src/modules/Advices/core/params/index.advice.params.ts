import type IndexParams from '@/base/Core/Params/indexParams';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class IndexAdviceParams implements IndexParams {
  public word: string;
  public withPage: number;
  public pageNumber: number;
  public perPage: number;

  public static readonly validation = new ClassValidation().setRules({
    word: { required: false },
    withPage: { required: false },
    pageNumber: { required: false },
    perPage: { required: false },
  });

  constructor(data: { word?: string; withPagination?: number; page?: number; perPage?: number }) {
    this.word = data.word ?? '';
    this.withPage = data.withPagination ?? 1;
    this.pageNumber = data.page ?? 1;
    this.perPage = data.perPage ?? 10;
  }

  toMap(): Record<string, unknown> {
    return {
      word: this.word,
      with_pagination: this.withPage,
      page: this.pageNumber,
      per_page: this.perPage,
    };
  }

  validate() {
    return IndexAdviceParams.validation.validate(this);
  }

  validateOrThrow() {
    return IndexAdviceParams.validation.validateOrThrow(this);
  }
}
