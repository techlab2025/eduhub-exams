import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import ArticleRepository from '../Artical.repository';
import ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';

describe('ArticleRepository', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should be defined', () => {
    expect(ArticleRepository).toBeDefined();
  });

  it('should get correct singleton instance', () => {
    const instance = ArticleRepository.getInstance();
    expect(instance).toBeInstanceOf(ArticleRepository);
  });

  it('parses the minimal response returned after creating an article', () => {
    const repository = ArticleRepository.getInstance() as unknown as {
      parseItem: (data: unknown) => ShowQuestionsModel;
    };

    const article = repository.parseItem({ question_id: 42 });

    expect(article).toBeInstanceOf(ShowQuestionsModel);
    expect(article.question_id).toBe(42);
    expect(article.topics).toEqual([]);
  });
});
