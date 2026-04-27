import TestDataFactory from '@/base/Core/Testing/testDataFactory';
import EducationClassificationModel from '../core/models/education.classification.model';

/**
 * Test data factory for country-related test data
 * Provides utilities to create mock countries for testing
 */
export class EducationClassificationTestFactory extends TestDataFactory {
  /**
   * Create a mock CountryModel with default or custom values
   */
  static createMockCountry(
    overrides?: Partial<{
      id: number;
      title: string;
      code: string;
      flag: string;
    }>,
  ): EducationClassificationModel {
    return new EducationClassificationModel({
      id: overrides?.id ?? this.randomInt(1, 1000),
      title: overrides?.title ?? `EducationClassification ${this.randomInt()}`,
    });
  }

  /**
   * Create a mock API JSON response for a country
   */
  static createMockCountryJson(
    overrides?: Partial<{
      id: number;
      title: string;
      code: string;
      flag: string;
    }>,
  ): any {
    return {
      id: overrides?.id ?? this.randomInt(1, 1000),
      title: overrides?.title ?? `Country ${this.randomInt()}`,
      code: overrides?.code ?? `C${this.randomInt(10, 99)}`,
      flag: overrides?.flag ?? '🏳️',
    };
  }

  /**
   * Create an array of mock countries
   */
  static createMockCountryList(count: number = 5): EducationClassificationModel[] {
    return this.generateArray(count, (index) =>
      this.createMockCountry({
        id: index + 1,
        title: `EducationClassification ${index + 1}`,
      }),
    );
  }

  /**
   * Create an array of mock country JSON responses
   */
  static createMockCountryJsonList(count: number = 5): any[] {
    return this.generateArray(count, (index) =>
      this.createMockCountryJson({
        id: index + 1,
        title: `EducationClassification ${index + 1}`,
      }),
    );
  }

  /**
   * Create a successful API response for a single country
   */
  static createCountryApiResponse(country?: EducationClassificationModel | any) {
    const countryData =
      country instanceof EducationClassificationModel
        ? {
            id: country.id,
            title: country.title,
          }
        : (country ?? this.createMockCountryJson());
    return this.apiResponse(countryData, true, 'Country retrieved successfully');
  }

  /**
   * Create a successful API response for a list of countries
   */
  static createCountryListApiResponse(countries?: EducationClassificationModel[] | any[]) {
    const countriesData =
      countries?.map((e: any) =>
        e instanceof EducationClassificationModel
          ? {
              id: e.id,
              title: e.title,
            }
          : e,
      ) ?? this.createMockCountryJsonList();
    return this.apiResponse(countriesData, true, 'Countries retrieved successfully');
  }

  /**
   * Create invalid country data for negative testing
   */
  static createInvalidCountryData(): any {
    return {
      id: null,
      title: '',
      code: 'INVALID',
    };
  }

  /**
   * Create error response for testing error handling
   */
  static createErrorCountryResponse(
    message: string = 'Country operation failed',
    statusCode: number = 500,
  ) {
    return this.errorApiResponse(message, statusCode);
  }

  /**
   * Create empty response for testing empty state
   */
  static createEmptyCountryListResponse() {
    return this.apiResponse([], true, 'No countries found');
  }
}

export default EducationClassificationTestFactory;
