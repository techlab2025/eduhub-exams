import type TitleInterface from '@/base/Data/Models/titleInterface';
import DocumentTranslationParams from '../params/translation.params';

export default class DocumentShowModel {
  public readonly id?: number;
   public readonly translations: {
    title: Record<string, string>;
  };
  public readonly title: Record<string, string>;
  public readonly RefNumber: string;

  public readonly documentType: TitleInterface<number>;
  public readonly stage: TitleInterface<number>;
  public readonly subject: TitleInterface<number>;

  // public readonly translations: DocumentTranslationParams;
  public readonly tags: string[];
  public readonly images: string[];
  public readonly files: string[];

  constructor(data: {
    id?: number;
    translations: {
      title: Record<string, string>;
    };
    title: Record<string, string>;
    RefNumber: string;

    documentType: TitleInterface<number>;
    stage: TitleInterface<number>;
    subject: TitleInterface<number>;

    // translations: DocumentTranslationParams;

    tags: string[];
    images: string[];
    files: string[];
  }) {
    this.id = data.id;
    this.translations = data.translations;
    this.title = data.title;
    this.RefNumber = data.RefNumber;

    this.documentType = data.documentType;
    this.stage = data.stage;
    this.subject = data.subject;

    this.translations = data.translations;

    this.tags = data.tags;
    this.images = data.images;
    this.files = data.files;

    Object.freeze(this);
  }

   static mapTranslations = (translations: any[], key: string = 'value') => {
      const result: Record<string, string> = {};
      if (Array.isArray(translations)) {
        translations.forEach((t: any) => {
          if (t.locale && t[key]) {
            result[t.locale] = t[key];
          }
        });
      }
      return result;
    };

  static fromJson(json: any): DocumentShowModel {
    if (!json) throw new Error('Invalid DocumentShowModel data');

    return new DocumentShowModel({
      id: json.id,
       translations: {
        title: this.mapTranslations(json.title, 'title'),
      },
      title: this.mapTranslations(json.title ?? []),

      RefNumber: json.RefNumber ?? json.reference_number ?? '',

      documentType: json.doecumentType ?? json.document_type ?? { id: 0, title: '' },

      stage: {
        id: json.stage?.id,
        title: json.stage?.titles?.[0]?.title ?? '',
      },

      subject: {
        id: json.subject?.id,
        title: json.subject?.titles?.[0]?.title ?? '',
      },

      // translations: json.translations
      //   ? new DocumentTranslationParams(json.translations)
      //   : new DocumentTranslationParams({
      //       title: { ar: '', en: '' },
      //       description: { ar: '', en: '' },
      //     }),

      tags: json.tags ?? [],
      images: json.images ?? [],
      files: json.files ?? [],
    });
  }

  static example: DocumentShowModel = new DocumentShowModel({
    id: 1,
    translations: {title: {ar:'title', en:'title'}},
    title: {ar:'title', en:'title'},
    RefNumber: '100',

    documentType: { id: 1, title: 'type' },
    stage: { id: 1, title: 'stage' },
    subject: { id: 1, title: 'subject' },

    // translations: new DocumentTranslationParams({
    //   title: { ar: '', en: '' },
    //   description: { ar: '', en: '' },
    // }),

    tags: [],
    images: [],
    files: [],
  });
}