import type TitleInterface from '@/base/Data/Models/titleInterface';
import DocumentTranslationParams from '../params/translation.params';

export default class DocumentShowModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly RefNumber: string;
  public readonly doecumentType: TitleInterface<number>;
  public readonly stage: TitleInterface<number>;
  public readonly subject: TitleInterface<number>;
  public readonly tranaslations: DocumentTranslationParams;
  public readonly tags: string[];
  public readonly images: string[];
  public readonly files: string[];

  constructor(data: {
    id?: number;
    title: string;
    RefNumber: string;
    doecumentType: TitleInterface<number>;
    stage: TitleInterface<number>;
    subject: TitleInterface<number>;
    tranaslations: DocumentTranslationParams;
    tags: string[];
    images: string[];
    files: string[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.RefNumber = data.RefNumber;
    this.doecumentType = data.doecumentType;
    this.stage = data.stage;
    this.subject = data.subject;
    this.tranaslations = data.tranaslations;
    this.tags = data.tags;
    this.images = data.images;
    this.files = data.files;

    Object.freeze(this);
  }

  static fromJson(json: any): DocumentShowModel {
    if (!json) {
      throw new Error('Cannot create DocumentShowModel from null or undefined');
    }

    return new DocumentShowModel({
      id: json.id,
      title: json.title,
      RefNumber: json.reference_number,
      doecumentType: json.document_type,
      stage: json.stage,
      subject: json.subject,
      tranaslations: json.tranaslations,
      tags: json.tags,
      images: json.images,
      files: json.files,
    });
  }

  static example: DocumentShowModel = new DocumentShowModel({
    id: 10,
    title: 'title',
    RefNumber: '10',
    doecumentType: {
      id: 1,
      title: 'title',
    },
    stage: {
      id: 1,
      title: 'title',
    },
    subject: {
      id: 1,
      title: 'title',
    },
    tranaslations: new DocumentTranslationParams({
      title: {
        ar: '',
        en: '',
      },
      description: {
        ar: '',
        en: '',
      },
    }),
    tags: ['tag1', 'tage2'],
    images: [],
    files: [],
  });
}
