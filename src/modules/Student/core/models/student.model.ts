import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';

export const StudentStatusEnum = { ACTIVE: '1', ARCHIVE: '2', BLOCK: '3' } as const;
export type StudentStatusEnum = (typeof StudentStatusEnum)[keyof typeof StudentStatusEnum];

export interface StudentTitleModel {
  id: number;
  title: string;
  children?: StudentTitleModel[];
}

export interface StudentNoteModel {
  id: number;
  note: string;
  created_at: string;
  created_by?: StudentTitleModel;
}

export interface StudentDetailsData {
  registration?: Record<string, unknown>;
  application_information?: Record<string, unknown>;
  performance?: Record<string, unknown>;
  plan?: Record<string, unknown>;
  notes?: StudentNoteModel[];
  [key: string]: unknown;
}

export default class StudentModel {
  public readonly id: number;
  public readonly name: string;
  public readonly image: string;
  public readonly serial: string;
  public readonly educationType: StudentTitleModel | null;
  public readonly educationStage: StudentTitleModel | null;
  public readonly grade: StudentTitleModel | null;
  public readonly currentPlan: StudentTitleModel | null;
  public readonly examsCount: number;
  public readonly studyPlanCount: number;
  public readonly status: StudentStatusEnum;
  public readonly joinDate: string;
  public readonly hasActiveSubscription: boolean;
  public readonly details: StudentDetailsData;

  constructor(
    id: number,
    name: string,
    image: string,
    serial: string,
    educationType: StudentTitleModel | null,
    educationStage: StudentTitleModel | null,
    grade: StudentTitleModel | null,
    currentPlan: StudentTitleModel | null,
    examsCount: number,
    studyPlanCount: number,
    status: StudentStatusEnum,
    joinDate: string,
    hasActiveSubscription: boolean,
    details: StudentDetailsData,
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
    this.hasActiveSubscription = hasActiveSubscription;
    this.details = details;
    Object.freeze(this);
  }

  private static titleFromJson(value: unknown): StudentTitleModel | null {
    if (!value || typeof value !== 'object') return null;
    const json = value as Record<string, unknown>;
    return {
      id: Number(json.id ?? 0),
      title: String(json.title ?? ''),
      children: Array.isArray(json.children)
        ? json.children
            .map((child) => StudentModel.titleFromJson(child))
            .filter((child): child is StudentTitleModel => child !== null)
        : [],
    };
  }

  static fromJson(json: Record<string, unknown>) {
    const registration =
      json.registration && typeof json.registration === 'object'
        ? (json.registration as Record<string, unknown>)
        : undefined;
    const currentPlan = StudentModel.titleFromJson(json.current_plan ?? json.plan);
    const hasActivePlan = SaftyConditions.booleanValue(
      json.has_active_plan ??
        json.hase_active_plan ??
        json.hase_active_subscription ??
        json.has_active_subscription,
    );

    return new StudentModel(
      Number(json.id ?? json.student_id),
      String(json.name ?? ''),
      String(json.image ?? ''),
      String(json.serial ?? ''),
      StudentModel.titleFromJson(json.education_type),
      StudentModel.titleFromJson(json.education_stage),
      StudentModel.titleFromJson(json.grade),
      currentPlan,
      Number(json.num_of_exams ?? 0),
      Number(json.num_of_study_plan ?? 0),
      String(json.status ?? StudentStatusEnum.ACTIVE) as StudentStatusEnum,
      String(json.join_date ?? registration?.register_date ?? ''),
      Boolean(currentPlan?.id) || hasActivePlan,
      json as StudentDetailsData,
    );
  }

  static readonly example = StudentModel.fromJson({
    id: 1,
    name: 'Ahmed Hawam',
    image: '',
    serial: 'ST-0001',
    education_type: {
      id: 1,
      title: 'Governmental',
      children: [
        {
          id: 2,
          title: 'Primary',
          children: [{ id: 3, title: 'First', children: [] }],
        },
      ],
    },
    education_stage: { id: 2, title: 'Primary' },
    grade: { id: 3, title: 'First' },
    current_plan: { id: 1, title: 'Basic' },
    num_of_exams: 20,
    num_of_study_plan: 20,
    status: StudentStatusEnum.ACTIVE,
    join_date: '09-05-2022',
    hase_active_subscription: false,
  });
}
