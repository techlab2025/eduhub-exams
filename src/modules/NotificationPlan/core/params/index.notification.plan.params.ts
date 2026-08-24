import IndexParams from '@/base/Core/Params/indexParams';

export default class IndexNotificationPlanParams extends IndexParams {
  public isActive?: boolean;

  constructor(word = '', page = 1, perPage = 10, isActive?: boolean) {
    super(word, page, perPage, 1);
    this.isActive = isActive;
  }

  toMap(): Record<string, unknown> {
    return {
      ...super.toMap(),
      ...(this.isActive !== undefined ? { is_active: this.isActive } : {}),
    };
  }
}
