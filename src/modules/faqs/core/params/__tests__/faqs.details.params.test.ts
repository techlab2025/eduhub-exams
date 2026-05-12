import { describe, it, expect } from 'vitest';
import FaqsDetailsParams from '../faqs.details.params';

describe('FaqsDetailsParams', () => {
  it('constructs with the given id', () => {
    const params = new FaqsDetailsParams({ id: 1 });
    expect(params.id).toBe(1);
  });

  it('toMap returns the faq_id', () => {
    const params = new FaqsDetailsParams({ id: 1 });
    expect(params.toMap()).toEqual({
      faq_id: 1,
    });
  });

  it('validate returns isValid:true when id is provided', () => {
    const params = new FaqsDetailsParams({ id: 1 });
    expect(params.validate().isValid).toBe(true);
  });

  it('validate returns isValid:false when id is missing', () => {
    const params = new FaqsDetailsParams({ id: null as unknown as number });
    expect(params.validate().isValid).toBe(false);
  });
});
