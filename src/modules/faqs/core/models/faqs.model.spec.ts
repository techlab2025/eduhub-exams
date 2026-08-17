import { describe, it, expect } from 'vitest';
import FaqsModel from './faqs.model';

describe('FaqsModel', () => {
  const mockData = {
    id: 1,
    question: { en: 'Q', ar: 'س' },
    answer: { en: 'A', ar: 'ج' },
  };

  it('creates an instance from constructor', () => {
    const model = new FaqsModel(mockData);
    expect(model.id).toBe(1);
    expect(model.question).toEqual({ en: 'Q', ar: 'س' });
    expect(model.answer).toEqual({ en: 'A', ar: 'ج' });
  });

  it('creates an instance fromJson', () => {
    const json = {
      id: 1,
      question: [{ locale: 'en', question: 'Q' }],
      answer: [{ locale: 'en', answer: 'A' }],
    };
    const model = FaqsModel.fromJson(json);
    expect(model.id).toBe(1);
    expect(model.question).toEqual({ en: 'Q' });
  });

  it('has examples', () => {
    expect(FaqsModel.example).toBeInstanceOf(FaqsModel);
  });
});
