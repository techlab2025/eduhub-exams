import { describe, expect, it } from 'vitest';
import TranslationParams from '@/modules/about/core/params/translation.params';
import AddFaqsParams from '../add.faqs.params';
import DeleteFaqsParams from '../delete.faqs.params';
import EditFaqsParams from '../edit.faqs.params';
import IndexFaqsParams from '../index.faqs.params';

const translations = new TranslationParams({ question: { en: 'q' }, answer: { en: 'a' } });

describe('Faqs Parameters', () => {
  it('serializes create, edit, delete, and index contracts', () => {
    expect(new AddFaqsParams({ translations }).toMap().translations.question.en).toBe('q');
    expect(new DeleteFaqsParams({ id: 1 }).toMap().faq_id).toBe(1);
    expect(new EditFaqsParams({ id: 1, translations }).toMap()).toMatchObject({
      faq_id: 1,
      translations: { answer: { en: 'a' } },
    });
    expect(new IndexFaqsParams().toMap().page).toBe(1);
  });
});
