import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import { DocumentIndexLevelTypeEnum } from '../constant/DocumentIndexLevel.enum';
import type { EditableDocumentIndexItem } from './editable.document.index.item.model';
import type DocumentIndexSourcePagesModel from './document.index.source.pages.model';
import DocumentIndexTopicModel from './document.index.topic.model';
import {
  mapDocumentIndexNodeData,
  toEditableDocumentIndexItem,
  type DocumentIndexNodeData,
} from './document.index.node.model';

export default class DocumentIndexLessonModel implements DocumentIndexNodeData {
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
  public readonly topics: DocumentIndexTopicModel[];

  constructor(data: DocumentIndexNodeData & { number: string; topics: DocumentIndexTopicModel[] }) {
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
    this.topics = data.topics;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexLessonModel {
    const data = SaftyConditions.objectValue(json);
    return new DocumentIndexLessonModel({
      ...mapDocumentIndexNodeData(data),
      number: String(data.number ?? ''),
      topics: (Array.isArray(data.topics) ? data.topics : []).map(DocumentIndexTopicModel.fromJson),
    });
  }

  toEditableItems(): EditableDocumentIndexItem[] {
    return [
      toEditableDocumentIndexItem(this, DocumentIndexLevelTypeEnum.LESSON),
      ...this.topics.map((topic) => topic.toEditableItem()),
    ];
  }
}
