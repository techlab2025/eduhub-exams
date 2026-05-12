import { describe, it, expect } from 'vitest';
import AddFaqsParams from '../add.faqs.params';
import DeleteFaqsParams from '../delete.faqs.params';
import EditFaqsParams from '../edit.faqs.params';
import TranslationParams from '@/modules/about/core/params/translation.params';
import IndexFaqsParams from '../index.faqs.params';

describe('Faqs Parameters', () => {
  it('AddFaqsParams converts to Map correctly', () => {
    const translations = new TranslationParams({ question: { en: 'q' }, answer: { en: 'a' } });
    const params = new AddFaqsParams({ translations });
    const map = params.toMap();
    expect(map.translations.question.en).toBe('q');
  });

  it('DeleteFaqsParams converts to Map correctly', () => {
    const params = new DeleteFaqsParams({ id: 1 });
    const map = params.toMap();
    expect(map.faq_id).toBe(1);
  });

  it('EditFaqsParams converts to Map correctly', () => {
    const translations = new TranslationParams({ question: { en: 'q' }, answer: { en: 'a' } });
    const params = new EditFaqsParams({ id: 1, translations });
    const map = params.toMap();
    expect(map.translations.question.en).toBe('q');
  });

  it('IndexFaqsParams converts to Map correctly', () => {
    const params = new IndexFaqsParams();
    const map = params.toMap();
    expect(map.page).toBe(1);
  });
});
