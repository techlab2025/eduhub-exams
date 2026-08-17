import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import EditFaqsParams from '../edit.faqs.params';

const translations = new TranslationParams({
  question: { en: 'Updated question?', ar: 'سؤال محدث؟' },
  answer: { en: 'Updated answer.', ar: 'إجابة محدثة.' },
});

describe('EditFaqsParams', () => {
  it('stores and serializes the FAQ identifier and translations', () => {
    const params = new EditFaqsParams({ id: 1, translations });

    expect(params.id).toBe(1);
    expect(params.translations).toBe(translations);
    expect(params.toMap()).toEqual({ faq_id: 1, translations: translations.toMap() });
    expect(params.validate().isValid).toBe(true);
  });

  it('fails validation without an id', () => {
    expect(new EditFaqsParams({ id: null as never, translations }).validate().isValid).toBe(false);
  });
});
