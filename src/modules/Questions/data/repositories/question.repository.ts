import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import questionsModel from '../../core/models/questions.model';
import QuestionApiService from '../api/question.api-service';

export default class questionsRepository extends BaseRepository<questionsModel, questionsModel[]> {
  private static instance: questionsRepository;

  protected get apiService() {
    return QuestionApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): questionsModel {
    return questionsModel.example;
  }

  protected get mockList(): questionsModel[] {
    return [questionsModel.example];
  }

  static getInstance(): questionsRepository {
    if (!questionsRepository.instance) {
      questionsRepository.instance = new questionsRepository();
    }
    return questionsRepository.instance;
  }

  protected parseItem(data: any): questionsModel {
    return questionsModel.fromJson(data);
  }

  protected parseList(data: any): questionsModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: questionsModel[], item) => {
      try {
        if (item != null) {
          acc.push(this.parseItem(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
