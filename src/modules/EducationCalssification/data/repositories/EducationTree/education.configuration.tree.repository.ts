import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import EducationClassificationTreeModel from '@/modules/EducationCalssification/core/models/EducationTree/education.classification.tree.model';
import EducationTreeApiService from '../../api/EducationTree/education.configuration.tree.api-service';
import BranchesModel from '@/modules/EducationCalssification/core/models/EducationTree/branches.model';

/**
 * Country Repository for API data operations
 *
 * This repository handles all data access for countries,
 * including parsing API responses and error handling.
 */
export default class EducationTreeRepository extends BaseRepository<
  EducationClassificationTreeModel,
  EducationClassificationTreeModel[]
> {
  private static instance: EducationTreeRepository;

  protected get apiService() {
    return EducationTreeApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): EducationClassificationTreeModel {
    return EducationClassificationTreeModel.example;
  }

  protected get mockList(): EducationClassificationTreeModel[] {
    return [
      { ...EducationClassificationTreeModel.example },
      {
        ...EducationClassificationTreeModel.example,
        branches: [BranchesModel.example],
        number_of_branches: 3,
      },
    ];
  }

  /**
   * Get singleton instance
   * @returns CountryRepository instance
   */
  static getInstance(): EducationTreeRepository {
    if (!EducationTreeRepository.instance) {
      EducationTreeRepository.instance = new EducationTreeRepository();
    }
    return EducationTreeRepository.instance;
  }

  protected parseItem(data: any): EducationClassificationTreeModel {
    return EducationClassificationTreeModel.fromJson(data);
  }

  protected parseList(data: any): EducationClassificationTreeModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: EducationClassificationTreeModel[], item) => {
      try {
        if (item != null) {
          acc.push(this.parseItem(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
