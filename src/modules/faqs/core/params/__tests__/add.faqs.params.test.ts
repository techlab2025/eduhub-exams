import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import AddFaqsParams from '../add.faqs.params';

const makeTranslation = () =>
  new TranslationParams({
    question: { en: 'What is this?', ar: 'ما هذا؟' },
    answer: { en: 'A frequently asked question.', ar: 'سؤال شائع.' },
  });

describe('AddFaqsParams', () => {
  it('stores and serializes FAQ translations', () => {
    const translations = makeTranslation();
    const params = new AddFaqsParams({ translations });

    expect(params.translations).toBe(translations);
    expect(params.toMap()).toEqual({ translations: translations.toMap() });
    expect(params.validate().isValid).toBe(true);
  });

  it('fails validation without translations', () => {
    const params = new AddFaqsParams({ translations: null as never });
    expect(params.validate().isValid).toBe(false);
  });
});
