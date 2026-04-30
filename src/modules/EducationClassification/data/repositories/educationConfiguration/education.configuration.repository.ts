import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import EducationConfigurationApiService from '../../api/education.configuration/education.configuration.api-service';
import EducationConfigurationModel from '@/modules/EducationClassification/core/models/EducationConfiguration/education.configuration.model';
import type Params from '@/base/Core/Params/params';

export default class EducationConfigurationRepository extends BaseRepository<
  EducationConfigurationModel,
  EducationConfigurationModel
> {
  private static instance: EducationConfigurationRepository;

  protected get apiService() {
    return EducationConfigurationApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: false,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): EducationConfigurationModel {
    return EducationConfigurationModel.example;
  }

  protected get mockList(): EducationConfigurationModel {
    return EducationConfigurationModel.example;
  }

  protected get testStoreIdField(): string {
    return 'education_classification_id';
  }

  protected paramsToStorageItem(params: Params): Record<string, unknown> {
    const map = params.toMap();
    // map.branches are already plain objects from AddEducationConfigurationParams.toMap()
    // Normalize translation keys to match what fromJson expects (SingularTitle/PluralTitle)
    const branches = (map.branches as any[]).map((branch) => ({
      level_number: branch.level_number,
      translations: {
        SingularTitle: branch.translations?.singular_title ?? {},
        PluralTitle: branch.translations?.plural_title ?? {},
      },
    }));
    return {
      education_classification_id: map.education_classification_id,
      number_of_branches: map.number_of_branches,
      branches,
    };
  }

  static getInstance(): EducationConfigurationRepository {
    if (!EducationConfigurationRepository.instance) {
      EducationConfigurationRepository.instance = new EducationConfigurationRepository();
    }
    return EducationConfigurationRepository.instance;
  }

  protected parseItem(data: any): EducationConfigurationModel {
    return EducationConfigurationModel.fromJson(data);
  }

  protected parseList(data: any): EducationConfigurationModel {
    const item = Array.isArray(data) ? data[0] : data;
    return EducationConfigurationModel.fromJson(item);
  }
}
