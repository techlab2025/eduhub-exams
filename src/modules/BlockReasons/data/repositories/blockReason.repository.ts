import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import BlockReasonModel from '../../core/models/blockReason.model';
import BlockReasonApiService from '../api/blockReason.api-service';

export default class BlockReasonRepository extends BaseRepository<
  BlockReasonModel,
  BlockReasonModel[]
> {
  private static instance: BlockReasonRepository;
  protected get apiService() {
    return BlockReasonApiService.getInstance();
  }
  protected get config(): RepositoryConfig {
    return { hasPagination: true, dataKey: 'data', paginationKey: 'meta' };
  }
  protected get mockItem() {
    return BlockReasonModel.example;
  }
  protected get mockList() {
    return [BlockReasonModel.example];
  }
  static getInstance() {
    if (!this.instance) this.instance = new BlockReasonRepository();
    return this.instance;
  }
  protected parseItem(data: unknown) {
    return BlockReasonModel.fromJson(data as Record<string, unknown>);
  }
  protected parseList(data: unknown) {
    return Array.isArray(data) ? data.map((item) => this.parseItem(item)) : [];
  }
}
