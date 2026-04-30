import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import EducationSubjectItemApiService from '../../api/education.subject/education.subject.item.api-service';
import EducationSubjectModel from '@/modules/EducationClassification/core/models/EducationSubject/education.subject.model';
import type Params from '@/base/Core/Params/params';

export default class EducationSubjectItemRepository extends BaseRepository<
  EducationSubjectModel,
  EducationSubjectModel[]
> {
  private static instance: EducationSubjectItemRepository;

  protected get apiService() {
    return EducationSubjectItemApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get testStoreIdField(): string {
    return 'subject_id';
  }

  protected paramsToStorageItem(params: Params): Record<string, unknown> {
    const map = params.toMap();
    return {
      subject_id: Date.now(),
      subject_title: map.title,
      has_children: false,
      stage_id: map.stage_id,
      parent_id: map.parent_id ?? null,
    };
  }

  static getInstance(): EducationSubjectItemRepository {
    if (!EducationSubjectItemRepository.instance) {
      EducationSubjectItemRepository.instance = new EducationSubjectItemRepository();
    }
    return EducationSubjectItemRepository.instance;
  }

  protected parseItem(data: unknown): EducationSubjectModel {
    return EducationSubjectModel.fromJson(data as Record<string, unknown>);
  }

  protected parseList(data: unknown): EducationSubjectModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: EducationSubjectModel[], item) => {
      try {
        if (item != null) acc.push(this.parseItem(item));
      } catch {}
      return acc;
    }, []);
  }
}
