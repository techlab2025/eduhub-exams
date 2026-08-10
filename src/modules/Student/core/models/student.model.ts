export const StudentStatusEnum = { ACTIVE: '1', ARCHIVE: '2', BLOCK: '3' } as const;
export type StudentStatusEnum = (typeof StudentStatusEnum)[keyof typeof StudentStatusEnum];

export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  archivedStudents: number;
  blockedStudents: number;
}

export default class StudentModel {
  public readonly id: number;
  public readonly name: string;
  public readonly image: string;
  public readonly serial: string;
  public readonly educationType: Record<string, any> | null;
  public readonly educationStage: Record<string, any> | null;
  public readonly grade: Record<string, any> | null;
  public readonly currentPlan: Record<string, any> | null;
  public readonly examsCount: number;
  public readonly studyPlanCount: number;
  public readonly status: StudentStatusEnum;
  public readonly joinDate: string;
  public readonly details: Record<string, any>;

  constructor(
    id: number,
    name: string,
    image: string,
    serial: string,
    educationType: Record<string, any> | null,
    educationStage: Record<string, any> | null,
    grade: Record<string, any> | null,
    currentPlan: Record<string, any> | null,
    examsCount: number,
    studyPlanCount: number,
    status: StudentStatusEnum,
    joinDate: string,
    details: Record<string, any>,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.serial = serial;
    this.educationType = educationType;
    this.educationStage = educationStage;
    this.grade = grade;
    this.currentPlan = currentPlan;
    this.examsCount = examsCount;
    this.studyPlanCount = studyPlanCount;
    this.status = status;
    this.joinDate = joinDate;
    this.details = details;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, any>) {
    return new StudentModel(
      Number(json.id ?? json.student_id),
      String(json.name ?? ''),
      String(json.image ?? ''),
      String(json.serial ?? ''),
      json.education_type ?? null,
      json.education_stage ?? null,
      json.grade ?? null,
      json.current_plan ?? json.plan ?? null,
      Number(json.num_of_exams ?? 0),
      Number(json.num_of_study_plan ?? 0),
      String(json.status ?? StudentStatusEnum.ACTIVE) as StudentStatusEnum,
      String(json.join_date ?? json.registration?.register_date ?? ''),
      json,
    );
  }

  static statsFromJson(json: Record<string, unknown>): StudentStats {
    return {
      totalStudents: Number(json.total_students ?? 0),
      activeStudents: Number(json.active_students ?? 0),
      archivedStudents: Number(json.archive_students ?? 0),
      blockedStudents: Number(json.blocked_students ?? 0),
    };
  }

  static readonly example = StudentModel.fromJson({ id: 1, name: 'Student', serial: 'ST-1' });
}
