export default class DocumentModel {
  public readonly id?: number;
  public readonly title: string;
  public readonly subjectId: number;
  public readonly stageId: number;
  public readonly unitIds: number[];
  public readonly documentTypeId: number;
  public readonly isAllUnits: boolean;

  constructor(data: {
    id?: number;
    title: string;
    subjectId: number;
    stageId: number;
    unitIds: number[];
    documentTypeId: number;
    isAllUnits: boolean;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.subjectId = data.subjectId;
    this.stageId = data.stageId;
    this.unitIds = data.unitIds;
    this.documentTypeId = data.documentTypeId;
    this.isAllUnits = data.isAllUnits;

    Object.freeze(this);
  }

  static fromJson(json: any): DocumentModel {
    if (!json) {
      throw new Error("Cannot create DocumentModel from null or undefined");
    }

    return new DocumentModel({
      id: json.id,
      title: json.title,
      subjectId: json.subject_id,
      stageId: json.stage_id,
      unitIds: json.unit_ids ?? [],
      documentTypeId: json.document_type_id,
      isAllUnits: json.isAllUnits ?? false,
    });
  }

  static example: DocumentModel = new DocumentModel({
    id: 1,
    title: "Sample Document",
    subjectId: 1,
    stageId: 1,
    unitIds: [1, 2],
    documentTypeId: 1,
    isAllUnits: false,
  });
}
