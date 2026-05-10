import type TitleInterface from '@/base/Data/Models/titleInterface';
import DocumentTranslationParams from '../../params/translation.params';

export default class DocumentTypeModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly RefNumber: string;
  public readonly doecumentType: TitleInterface<number>;
  public readonly Subjtecs: TitleInterface<number>[];
  public readonly tranaslations: DocumentTranslationParams;

  constructor(data: {
    id?: number; 
    title: string;
    RefNumber: string;
    doecumentType: TitleInterface<number>;
    Subjtecs: TitleInterface<number>[];
    tranaslations: DocumentTranslationParams;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.RefNumber = data.RefNumber;
    this.doecumentType = data.doecumentType;
    this.Subjtecs = data.Subjtecs;
    this.tranaslations = data.tranaslations;

    Object.freeze(this);
  }

  static fromJson(json: any): DocumentTypeModel {
    if (!json) {
      throw new Error('Cannot create DocumentTypeModel from null or undefined');
    }

    return new DocumentTypeModel({
      id: json.id,
      title: json.title,
      RefNumber: json.ref_number,
      doecumentType: json.document_type,
      Subjtecs: json.subjtecs ?? [],
      tranaslations: json.tranaslations,
    });
  }

  static example: DocumentTypeModel = new DocumentTypeModel({
    id: 10,
    title: 'title',
    RefNumber: '10',
    doecumentType: {
      id: 1,
      title: 'title',
    },
    Subjtecs: [
      {
        id: 1,
        title: 'aa',
      },
    ],
    tranaslations: new DocumentTranslationParams({
      description: {
        ar: '',
        en: '',
      },
      title: {
        ar: '',
        en: '',
      },
    }),
  });
}
