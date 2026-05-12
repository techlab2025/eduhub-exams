import { describe, it, expect } from 'vitest';
import FaqsModel from './faqs.model';

describe('FaqsModel', () => {
  const mockData = {
    id: 1,
    question: [
      { locale: 'en', question: 'Q' },
      { locale: 'ar', question: 'س' },
    ],
    answer: [
      { locale: 'en', answer: 'A' },
      { locale: 'ar', answer: 'ج' },
    ],
  };

  it('creates an instance from constructor', () => {
    const model = new FaqsModel(mockData);
    expect(model.id).toBe(1);
    expect(model.question[0].question).toBe('Q');
    expect(model.answer[1].answer).toBe('ج');
  });

  it('creates an instance fromJson with translations object', () => {
    const json = {
      id: 1,
      translations: {
        question: { en: 'Q' },
        answer: { en: 'A' },
      },
    };
    const model = FaqsModel.fromJson(json);
    expect(model.id).toBe(1);
    expect(model.question[0].locale).toBe('en');
    expect(model.question[0].question).toBe('Q');
  });

  it('creates an instance fromJson with arrays', () => {
    const json = {
      id: 1,
      question: [{ locale: 'en', question: 'Q' }],
      answer: [{ locale: 'en', answer: 'A' }],
    };
    const model = FaqsModel.fromJson(json);
    expect(model.question[0].question).toBe('Q');
  });

  it('has examples', () => {
    expect(FaqsModel.examples.length).toBeGreaterThan(0);
    expect(FaqsModel.example).toBeInstanceOf(FaqsModel);
  });
});
