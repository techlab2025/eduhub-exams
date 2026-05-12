import { describe, it, expect } from 'vitest';
import EditFaqsParams from '../edit.faqs.params';
import TranslationParams from '@/modules/about/core/params/translation.params';

const makeTranslations = () =>
  new TranslationParams({
    question: { en: 'Updated question?', ar: 'سؤال محدث؟' },
    answer: { en: 'Updated answer.', ar: 'إجابة محدثة.' },
  });

describe('EditFaqsParams', () => {
  it('constructs with correct fields', () => {
    const translations = makeTranslations();
    const params = new EditFaqsParams({ id: 1, translations });
    expect(params.id).toBe(1);
    expect(params.translations).toBe(translations);
  });

  it('toMap serialises correctly', () => {
    const translations = makeTranslations();
    const params = new EditFaqsParams({ id: 1, translations });
    expect(params.toMap()).toEqual({
      faq_id: 1,
      translations: translations.toMap(),
    });
  });

  it('validate returns isValid:true with a valid id', () => {
    const params = new EditFaqsParams({ id: 1, translations: makeTranslations() });
    expect(params.validate().isValid).toBe(true);
  });

  it('validate returns isValid:false when id is null', () => {
    const params = new EditFaqsParams({
      id: null as unknown as number,
      translations: makeTranslations(),
    });
    expect(params.validate().isValid).toBe(false);
  });
});
