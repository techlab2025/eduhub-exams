import { describe, it, expect } from 'vitest';
import AddFaqsParams from '../add.faqs.params';
import TranslationParams from '@/modules/about/core/params/translation.params';

const makeTranslations = () =>
  new TranslationParams({
    question: { en: 'What is this?', ar: 'ما هذا؟' },
    answer: { en: 'This is a FAQ.', ar: 'هذا سؤال شائع.' },
  });

describe('AddFaqsParams', () => {
  it('constructs with translations', () => {
    const translations = makeTranslations();
    const params = new AddFaqsParams({ translations });
    expect(params.translations).toBe(translations);
  });

  it('toMap serialises translations using TranslationParams.toMap', () => {
    const translations = makeTranslations();
    const params = new AddFaqsParams({ translations });
    const map = params.toMap();
    expect(map.translations).toEqual(translations.toMap());
  });

  it('validate returns isValid:true when translations are provided', () => {
    const params = new AddFaqsParams({ translations: makeTranslations() });
    expect(params.validate().isValid).toBe(true);
  });

  it('validate returns isValid:false when translations are missing', () => {
    const params = new AddFaqsParams({ translations: null as unknown as TranslationParams });
    expect(params.validate().isValid).toBe(false);
  });
});
