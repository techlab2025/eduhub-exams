import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import EducationStageApiService from '../../api/EducationStage/education.stage.api-service';
import EducationStageModel from '@/modules/EducationClassification/core/models/EducationStage/education.stages.model';
import type Params from '@/base/Core/Params/params';

/**
 * Education Classification Repository for API data operations
 *
 * This repository handles all data access for education classifications,
 * including parsing API responses and error handling.
 */
export default class EducationStageRepository extends BaseRepository<
  EducationStageModel,
  EducationStageModel[]
> {
  private static instance: EducationStageRepository;

  protected get apiService() {
    return EducationStageApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): EducationStageModel {
    return EducationStageModel.example;
  }

  protected get mockList(): EducationStageModel[] {
    return [
      { ...EducationStageModel.example },
    ];
  }

  protected get testStoreIdField(): string {
    return 'stage_id';
  }

  protected paramsToStorageItem(params: Params): Record<string, unknown> {
    const map = params.toMap();
    return {
      stage_id: Date.now(),
      stage_title: map.title as string,
      has_children: false,
    };
  }

  /**
   * Get singleton instance
   * @returns EducationClassificationRepository instance
   */
  static getInstance(): EducationStageRepository {
    if (!EducationStageRepository.instance) {
      EducationStageRepository.instance = new EducationStageRepository();
    }
    return EducationStageRepository.instance;
  }

  protected parseItem(data: unknown): EducationStageModel {
    return EducationStageModel.fromJson(data as Record<string, unknown>);
  }

  protected parseList(data: unknown): EducationStageModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: EducationStageModel[], item) => {
      try {
        if (item != null) {
          acc.push(this.parseItem(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
