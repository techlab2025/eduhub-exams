import { describe, expect, it } from 'vitest';
import FaqsDetailsParams from '../faqs.details.params';

describe('FaqsDetailsParams', () => {
  it('maps the FAQ identifier and retains locale behavior', () => {
    const params = new FaqsDetailsParams({ id: 7, isLocale: false });

    expect(params.id).toBe(7);
    expect(params.isLocale).toBe(false);
    expect(params.toMap()).toEqual({ faq_id: 7 });
    expect(params.validate().isValid).toBe(true);
  });

  it('defaults to localized fetching and requires an id', () => {
    expect(new FaqsDetailsParams({ id: 1 }).isLocale).toBe(true);
    expect(new FaqsDetailsParams({ id: null as never }).validate().isValid).toBe(false);
  });
});
