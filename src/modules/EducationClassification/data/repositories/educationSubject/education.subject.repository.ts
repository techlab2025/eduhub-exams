import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import EducationSubjectApiService from '../../api/education.subject/education.subject.api-service';
import EducationSubjectConfigurationModel from '@/modules/EducationClassification/core/models/EducationConfiguration/education.subject.configuration.model';
import type Params from '@/base/Core/Params/params';

export default class EducationSubjectRepository extends BaseRepository<
  EducationSubjectConfigurationModel,
  EducationSubjectConfigurationModel
> {
  private static instance: EducationSubjectRepository;

  protected get apiService() {
    return EducationSubjectApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: false,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): EducationSubjectConfigurationModel {
    return EducationSubjectConfigurationModel.example;
  }

  protected get mockList(): EducationSubjectConfigurationModel {
    return EducationSubjectConfigurationModel.example;
  }

  protected paramsToStorageItem(params: Params): Record<string, unknown> {
    const map = params.toMap();
    // branches come from ConfigurationParams.toMap() which uses "translations" (plural)
    const branches = (map.branches as any[]).map((branch) => ({
      level_number: branch.level_number,
      translation: {
        SingularTitle: branch.translations?.singular_title ?? {},
        PluralTitle: branch.translations?.plural_title ?? {},
      },
    }));
    return {
      education_classification_id: map.education_classification_id,
      translation: {
        SingularTitle: (map.translations as any)?.singular_title ?? {},
        PluralTitle: (map.translations as any)?.plural_title ?? {},
      },
      number_of_branches: map.number_of_branches,
      branches,
    };
  }

  static getInstance(): EducationSubjectRepository {
    if (!EducationSubjectRepository.instance) {
      EducationSubjectRepository.instance = new EducationSubjectRepository();
    }
    return EducationSubjectRepository.instance;
  }

  protected parseItem(data: any): EducationSubjectConfigurationModel {
    return EducationSubjectConfigurationModel.fromJson(data);
  }

  protected parseList(data: any): EducationSubjectConfigurationModel {
    const item = Array.isArray(data) ? data[data.length - 1] : data;
    return EducationSubjectConfigurationModel.fromJson(item);
  }
}
