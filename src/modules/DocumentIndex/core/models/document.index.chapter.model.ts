import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import { DocumentIndexLevelTypeEnum } from '../constant/DocumentIndexLevel.enum';
import type { EditableDocumentIndexItem } from './editable.document.index.item.model';
import DocumentIndexLessonModel from './document.index.lesson.model';
import type DocumentIndexSourcePagesModel from './document.index.source.pages.model';
import {
  mapDocumentIndexNodeData,
  toEditableDocumentIndexItem,
  type DocumentIndexNodeData,
} from './document.index.node.model';

export default class DocumentIndexChapterModel implements DocumentIndexNodeData {
  public readonly id: number;
  public readonly position: number;
  public readonly number: string;
  public readonly title: string;
  public readonly description: string | null;
  public readonly sourcePages: DocumentIndexSourcePagesModel;
  public readonly sourceHash: string;
  public readonly sourceUrlJson: string;
  public readonly sourceUrlTxt: string;
  public readonly confidence: number;
  public readonly isInferred: boolean;
  public readonly inferenceLevel: string;
  public readonly printedPageLabel: string;
  public readonly lessons: DocumentIndexLessonModel[];

  constructor(
    data: DocumentIndexNodeData & { number: string; lessons: DocumentIndexLessonModel[] },
  ) {
    this.id = data.id;
    this.position = data.position;
    this.number = data.number;
    this.title = data.title;
    this.description = data.description;
    this.sourcePages = data.sourcePages;
    this.sourceHash = data.sourceHash;
    this.sourceUrlJson = data.sourceUrlJson;
    this.sourceUrlTxt = data.sourceUrlTxt;
    this.confidence = data.confidence;
    this.isInferred = data.isInferred;
    this.inferenceLevel = data.inferenceLevel;
    this.printedPageLabel = data.printedPageLabel;
    this.lessons = data.lessons;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexChapterModel {
    const data = SaftyConditions.objectValue(json);
    return new DocumentIndexChapterModel({
      ...mapDocumentIndexNodeData(data),
      number: String(data.number ?? ''),
      lessons: (Array.isArray(data.lessons) ? data.lessons : []).map(
        DocumentIndexLessonModel.fromJson,
      ),
    });
  }

  toEditableItems(): EditableDocumentIndexItem[] {
    return [
      toEditableDocumentIndexItem(this, DocumentIndexLevelTypeEnum.CHAPTER),
      ...this.lessons.flatMap((lesson) => lesson.toEditableItems()),
    ];
  }
}
