import type IndexParams from '@/base/Core/Params/indexParams';
import { ClassValidation } from '@/base/Presentation/Utils/classValidation';

export default class IndexHighLightsBadgesParams implements IndexParams {
  public word: string = '';
  public withPage: number = 1;
  public perPage: number = 10;
  public pageNumber: number = 1;

  public static readonly validation = new ClassValidation().setRules({
    word: { required: false },
    withPage: { required: false },
    perPage: { required: false },
    pageNumber: { required: false },
  });

  constructor(data: { word?: string; withPage?: number; perPage?: number; pageNumber?: number }) {
    this.word = data.word ?? '';
    this.withPage = data.withPage ?? 1;
    this.perPage = data.perPage ?? 10;
    this.pageNumber = data.pageNumber ?? 1;
  }

  toMap(): Record<string, unknown> {
    return {
      word: this.word,
      with_page: this.withPage,
      per_page: this.perPage,
      page_number: this.pageNumber,
    };
  }

  validate() {
    return IndexHighLightsBadgesParams.validation.validate(this);
  }

  validateOrThrow() {
    return IndexHighLightsBadgesParams.validation.validateOrThrow(this);
  }
}
