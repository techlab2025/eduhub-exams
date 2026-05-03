import TranslationModel from '@/modules/about/core/models/translation.model';

/**
 * Country model representing a nation's geographical and cultural data
 */
export default class TermsConditionsModel {
  public readonly translations: TranslationModel;

  constructor(data: { translations: TranslationModel }) {
    this.translations = data.translations;

    Object.freeze(this);
  }

  /**
   * Create CountryModel from API response
   * @param json - Raw JSON data from API
   * @returns FaqsModel instance
   */
  static fromJson(json: any): TermsConditionsModel {
    if (!json) {
      throw new Error('Cannot create FaqsModel from null or undefined');
    }

    return new TermsConditionsModel({
      translations: TranslationModel.fromJson(json.translations),
    });
  }

  static example: TermsConditionsModel = new TermsConditionsModel({
    translations: new TranslationModel({
      title: {
        ar: 'terms_conditions_ar',
        en: 'terms_conditions_en',
      },
      description: {
        ar: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        en: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
      },
    }),
  });
}
