import SocialModel from './social.model';
import TranslationModel from './translation.model';
import Image from '@/assets/images/FeatureHeader.jpg';
import Facebook from '@/assets/images/SocialLinks/facebook.png';
import x from '@/assets/images/SocialLinks/x.png';
import instagram from '@/assets/images/SocialLinks/instagram.png';

/**
 * Employee model representing an employee entity
 */
export default class AboutModel {
  public readonly id?: number;
  public readonly translations: TranslationModel;
  public readonly images: string;
  public readonly socailMedia: SocialModel[];

  constructor(data: {
    id?: number;
    translations: TranslationModel;
    images: string;
    socailMedia: SocialModel[];
  }) {
    this.id = data.id;
    this.translations = data.translations;
    this.images = data.images;
    this.socailMedia = data.socailMedia;

    Object.freeze(this);
  }

  /**
   * Create EmployeeModel from API response
   * @param json - Raw JSON data from API
   * @returns EmployeeModel instance
   */
  static fromJson(json: any): AboutModel {
    if (!json) {
      throw new Error('Cannot create EmployeeModel from null or undefined');
    }

    return new AboutModel({
      id: json.id,
      translations: json.translations,
      images: json.images,
      socailMedia: json.socail_media.map((el: any) => el.socailMedia.fromJson(el)),
    });
  }

  static example: AboutModel = new AboutModel({
    id: 1,
    translations: new TranslationModel({
      description: {
        ar: 'Smart Learning Platform',
        en: 'Smart Learning Platform',
      },
      title: {
        ar: 'Smart Learning Platform',
        en: 'Smart Learning Platform',
      },
    }),
    images: Image,
    socailMedia: [
      new SocialModel({
        link: 'socail/insta',
        icon: instagram,
      }),
      new SocialModel({
        link: 'socail/face',
        icon: Facebook,
      }),
      new SocialModel({
        link: 'socail/x',
        icon: x,
      }),
    ],
  });
}
