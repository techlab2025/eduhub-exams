import { nextTick, unref, type Ref } from 'vue';

export type ValidationError = {
  key: string;
  message: string;
};

export type ValidationRefs = Record<
  string,
  {
    ref: Ref<HTMLElement | null> | HTMLElement | null;
    block?: ScrollLogicalPosition;
  }
>;

export default class ValidationErrorScroller {
  public errors: ValidationError[];
  public refs: ValidationRefs;

  constructor(errors: ValidationError[], refs: ValidationRefs) {
    this.errors = errors;
    this.refs = refs;
  }

  async scrollToError() {
    if (this.errors.length === 0) return;

    await nextTick();

    const firstError = this.errors[0];

    if (!firstError) return;

    const config = this.refs[firstError.key];

    if (!config) return;

    const element = unref(config.ref);

    element?.scrollIntoView({
      behavior: 'smooth',
      block: config.block ?? 'center',
    });
  }
}
