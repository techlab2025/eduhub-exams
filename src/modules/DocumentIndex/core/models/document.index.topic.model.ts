import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import { DocumentIndexLevelTypeEnum } from '../constant/DocumentIndexLevel.enum';
import type { EditableDocumentIndexItem } from './editable.document.index.item.model';
import type DocumentIndexSourcePagesModel from './document.index.source.pages.model';
import {
  mapDocumentIndexNodeData,
  toEditableDocumentIndexItem,
  type DocumentIndexNodeData,
} from './document.index.node.model';

export default class DocumentIndexTopicModel implements DocumentIndexNodeData {
  public readonly id: number;
  public readonly position: number;
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
  public readonly importantConcepts: unknown[];
  public readonly subtopics: unknown[];

  constructor(
    data: DocumentIndexNodeData & { importantConcepts: unknown[]; subtopics: unknown[] },
  ) {
    this.id = data.id;
    this.position = data.position;
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
    this.importantConcepts = data.importantConcepts;
    this.subtopics = data.subtopics;
    Object.freeze(this);
  }

  static fromJson(json: unknown): DocumentIndexTopicModel {
    const data = SaftyConditions.objectValue(json);
    return new DocumentIndexTopicModel({
      ...mapDocumentIndexNodeData(data),
      importantConcepts: Array.isArray(data.important_concepts) ? data.important_concepts : [],
      subtopics: Array.isArray(data.subtopics) ? data.subtopics : [],
    });
  }

  toEditableItem(): EditableDocumentIndexItem {
    return toEditableDocumentIndexItem(this, DocumentIndexLevelTypeEnum.TOPIC);
  }
}
