import BaseRepository, { type RepositoryConfig } from '@/base/Domain/Repositories/baseRepository';
import CountryModel from '../../core/models/country.model';
import CountryApiService from '../api/country.api-service';

/**
 * Country Repository for API data operations
 *
 * This repository handles all data access for countries,
 * including parsing API responses and error handling.
 */
export default class CountryRepository extends BaseRepository<CountryModel, CountryModel[]> {
  private static instance: CountryRepository;

  protected get apiService() {
    return CountryApiService.getInstance();
  }

  protected get config(): RepositoryConfig {
    return {
      hasPagination: true,
      dataKey: 'data',
      paginationKey: 'meta',
    };
  }

  protected get mockItem(): CountryModel {
    return CountryModel.example;
  }

  protected get mockList(): CountryModel[] {
    return [
      CountryModel.example,
      { ...CountryModel.example, title: "Country 2", code: "CO2", id: 2, flag: "🇨🇴" },
        {
        ...CountryModel.example,
        title: "Country 10",
        code: "CO10",
        id: 10,
        flag: "🇨🇴",
      },
    ];
  }

  /**
   * Get singleton instance
   * @returns CountryRepository instance
   */
  static getInstance(): CountryRepository {
    if (!CountryRepository.instance) {
      CountryRepository.instance = new CountryRepository();
    }
    return CountryRepository.instance;
  }

  protected parseItem(data: any): CountryModel {
    return CountryModel.fromJson(data);
  }

  protected parseList(data: any): CountryModel[] {
    if (!Array.isArray(data)) return [];
    return data.reduce((acc: CountryModel[], item) => {
      try {
        if (item != null) {
          acc.push(this.parseItem(item));
        }
      } catch {}
      return acc;
    }, []);
  }
}
