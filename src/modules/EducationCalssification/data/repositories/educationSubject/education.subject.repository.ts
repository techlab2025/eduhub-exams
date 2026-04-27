import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import EducationConfigurationApiService from '../../api/education.configuration/education.configuration.api-service';
import EducationClassificationModel from '@/modules/EducationCalssification/core/models/education.classification.model';

/**
 * Country Repository for API data operations
 *
 * This repository handles all data access for countries,
 * including parsing API responses and error handling.
 */
export default class EducationSubjectRepository extends BaseRepository<
  EducationClassificationModel,
  EducationClassificationModel[]
> {
  private static instance: EducationSubjectRepository;

  protected get apiService() {
    return EducationConfigurationApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): EducationClassificationModel {
    return EducationClassificationModel.example;
  }

  protected get mockList(): EducationClassificationModel[] {
    return [{ ...EducationClassificationModel.example }];
  }

  /**
   * Get singleton instance
   * @returns CountryRepository instance
   */
  static getInstance(): EducationSubjectRepository {
    if (!EducationSubjectRepository.instance) {
      EducationSubjectRepository.instance = new EducationSubjectRepository();
    }
    return EducationSubjectRepository.instance;
  }

  protected parseItem(data: any): EducationClassificationModel {
    return EducationClassificationModel.fromJson(data);
  }

  protected parseList(data: any): EducationClassificationModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: EducationClassificationModel[], item) => {
      try {
        if (item != null) {
          acc.push(this.parseItem(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
