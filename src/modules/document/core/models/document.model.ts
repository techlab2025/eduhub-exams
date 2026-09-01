import type TitleInterface from '@/base/Data/Models/titleInterface';
import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import DocumentTranslationParams from '../params/translation.params';

const stringList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const stringRecord = (value: unknown): Record<string, string> =>
  Object.fromEntries(
    Object.entries(SaftyConditions.objectValue(value)).map(([key, item]) => [key, String(item)]),
  );

export default class DocumentModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly RefNumber: string;
  public readonly doecumentType: TitleInterface<number>;
  public readonly Subjtecs: TitleInterface<number>[];
  public readonly tranaslations: DocumentTranslationParams;
  public readonly tags: string[];
  public readonly images: string[];
  public readonly files: string[];
  public readonly description: string | Record<string, string> | unknown[];
  public readonly image: string;
  public readonly file: string;
  public readonly indexFile: string;
  public readonly hasIndex: boolean;
  public readonly transactionId: string;
  public readonly indexPatchId: number;
  public readonly indexStatus: number;

  constructor(data: {
    id?: number;
    title: string;
    RefNumber: string;
    doecumentType: TitleInterface<number>;
    Subjtecs: TitleInterface<number>[];
    tranaslations: DocumentTranslationParams;
    tags: string[];
    images: string[];
    files: string[];
    description?: string | Record<string, string> | unknown[];
    image?: string;
    file?: string;
    indexFile?: string;
    hasIndex?: boolean;
    transactionId?: string;
    indexPatchId?: number;
    indexStatus?: number;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.RefNumber = data.RefNumber;
    this.doecumentType = data.doecumentType;
    this.Subjtecs = data.Subjtecs;
    this.tranaslations = data.tranaslations;
    this.tags = data.tags;
    this.images = data.images;
    this.files = data.files;
    this.description = data.description ?? '';
    this.image = data.image ?? '';
    this.file = data.file ?? '';
    this.indexFile = data.indexFile ?? '';
    this.hasIndex = data.hasIndex ?? Boolean(this.indexFile);
    this.transactionId = data.transactionId ?? '';
    this.indexPatchId = data.indexPatchId ?? 0;
    this.indexStatus = data.indexStatus ?? 0;

    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentModel {
    if (json == null || typeof json !== 'object' || Array.isArray(json)) {
      throw new Error('Cannot create DocumentModel from null or undefined');
    }

    const data = SaftyConditions.objectValue(json);
    const documentIndex = SaftyConditions.objectValue(data.document_index);
    const index = SaftyConditions.objectValue(data.index);
    const indexPatch =
      Object.keys(SaftyConditions.objectValue(data.document_index_patch)).length > 0
        ? SaftyConditions.objectValue(data.document_index_patch)
        : Object.keys(SaftyConditions.objectValue(data.index_patch)).length > 0
          ? SaftyConditions.objectValue(data.index_patch)
          : documentIndex;
    const translationsData = SaftyConditions.objectValue(data.tranaslations);
    const translations = new DocumentTranslationParams({
      title: stringRecord(translationsData.title),
      description: stringRecord(translationsData.description),
    });
    const images = stringList(data.images);
    const files = stringList(data.files);
    const rawDescription = data.description;
    const description =
      typeof rawDescription === 'string' || Array.isArray(rawDescription)
        ? rawDescription
        : Object.keys(SaftyConditions.objectValue(rawDescription)).length > 0
          ? stringRecord(rawDescription)
          : translations.description;
    const explicitIndexFlag = data.has_index ?? data.is_indexed;

    return new DocumentModel({
      id: SaftyConditions.numberValue(data.id),
      title: String(data.title ?? ''),
      RefNumber: String(data.ref_number ?? ''),
      doecumentType: SaftyConditions.titleValueCheck(data.document_type) ?? { id: 0, title: '' },
      Subjtecs: Array.isArray(data.subjtecs)
        ? data.subjtecs
            .map((subject) => SaftyConditions.titleValueCheck(subject))
            .filter((subject) => subject != null)
        : [],
      tranaslations: translations,
      tags: stringList(data.tags),
      images,
      files,
      description,
      image: typeof data.image === 'string' ? data.image : (images[0] ?? ''),
      file: typeof data.document_file === 'string' ? data.document_file : (files[0] ?? ''),
      indexFile:
        typeof data.index_file === 'string'
          ? data.index_file
          : typeof documentIndex.file === 'string'
            ? documentIndex.file
            : typeof documentIndex.url === 'string'
              ? documentIndex.url
              : typeof index.file === 'string'
                ? index.file
                : '',
      hasIndex:
        explicitIndexFlag != null
          ? SaftyConditions.booleanValue(explicitIndexFlag)
          : Object.keys(documentIndex).length > 0 ||
            typeof data.index_file === 'string' ||
            Object.keys(index).length > 0,
      transactionId: String(
        data.transaction_id ??
          data.transactionId ??
          documentIndex.transaction_id ??
          index.transaction_id ??
          indexPatch.transaction_id ??
          '',
      ),
      indexPatchId: Number(
        data.document_index_patch_id ??
          data.index_patch_id ??
          indexPatch.patch_id ??
          indexPatch.document_index_patch_id ??
          indexPatch.id ??
          0,
      ),
      indexStatus: Number(
        data.document_index_status ??
          data.index_status ??
          indexPatch.status ??
          indexPatch.index_status ??
          0,
      ),
    });
  }

  static example: DocumentModel = new DocumentModel({
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
      title: {
        ar: 'عنوان',
        en: 'title',
      },
      description: {
        ar: 'وصف',
        en: 'description',
      },
    }),
    tags: ['tag1', 'tage2'],
    images: [],
    files: [],
  });
}
