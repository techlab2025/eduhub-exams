import type TitleInterface from '@/base/Data/Models/titleInterface';
import { StudentStatusEnum, type StudentTitleModel } from './student.model';

export interface StudentEducationModel extends StudentTitleModel {
  children: StudentEducationModel[];
}

export interface StudentRegistrationModel {
  registerDate: string;
  authenticationMethod: string;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface StudentApplicationModel {
  registrationMethod: string;
  deviceUsed: string;
  operationSystem: string;
  appVersion: string;
  currentStatus: string;
  lastSeen: string;
}

export interface StudentPlanModel extends StudentTitleModel {
  planStatus: StudentStatusEnum;
  totalPaid: number;
  paymentMethod: string;
  subscribeDate: string;
  expireDate: string;
}

export interface StudentPerformanceModel {
  totalPlacementTests: number;
  placementTestsThisMonth: number;
  totalPracticesPlan: number;
  totalPracticesPlanThisMonth: number;
}

export interface StudentResultModel extends StudentTitleModel {
  correctCount: number;
  wrongCount: number;
}

export interface StudentNoteModel {
  id: number;
  note: string;
  createdAt: string;
  createdBy: { id: number; name: string } | null;
}

const objectValue = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {};

const titleValue = (value: unknown): StudentTitleModel | null => {
  if (!value || typeof value !== 'object') return null;
  const json = objectValue(value);
  return { id: Number(json.id ?? 0), title: String(json.title ?? '') };
};

const educationValue = (value: unknown): StudentEducationModel | null => {
  if (!value || typeof value !== 'object') return null;
  const json = objectValue(value);
  return {
    id: Number(json.id ?? 0),
    title: String(json.title ?? ''),
    children: Array.isArray(json.children)
      ? json.children
          .map(educationValue)
          .filter((item): item is StudentEducationModel => item !== null)
      : [],
  };
};

const resultList = (value: unknown): StudentResultModel[] =>
  Array.isArray(value)
    ? value.map((item) => {
        const json = objectValue(item);
        return {
          id: Number(json.id ?? 0),
          title: String(json.title ?? ''),
          correctCount: Number(json.correct_count ?? 0),
          wrongCount: Number(json.wrong_count ?? 0),
        };
      })
    : [];

export default class ShowStudentModel {
  public readonly id!: number;
  public readonly name!: string;
  public readonly image!: string;
  public readonly serial!: string;
  public readonly status!: StudentStatusEnum;
  public readonly points!: number;
  public readonly rank!: string;
  public readonly phone!: string;
  public readonly educationType!: StudentEducationModel | null;
  public readonly educationStage!: StudentTitleModel | null;
  public readonly grade!: StudentTitleModel | null;
  public readonly parentName!: string;
  public readonly parentPhone!: string;
  public readonly reason!: string;
  public readonly blockedBy!: { id: number; name: string } | null;
  public readonly blockDate!: string;
  public readonly registration!: StudentRegistrationModel;
  public readonly applicationInformation!: StudentApplicationModel;
  public readonly plan!: StudentPlanModel | null;
  public readonly performance!: StudentPerformanceModel;
  public readonly placementTests!: StudentResultModel[];
  public readonly practicesPlan!: StudentResultModel[];
  public readonly studentSchedules!: unknown[];
  public readonly notes!: StudentNoteModel[];
  public readonly subjects!: TitleInterface<string>[];

  private constructor(values: ShowStudentModel) {
    Object.assign(this, values);
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): ShowStudentModel {
    const registration = objectValue(json.registration);
    const application = objectValue(json.application_information);
    const planJson = objectValue(json.plan);
    const performance = objectValue(json.performance);
    const blockedBy = objectValue(json.blocked_by);
    const planTitle = titleValue(json.plan);

    return new ShowStudentModel({
      id: Number(json.id ?? json.student_id ?? 0),
      name: String(json.name ?? ''),
      image: String(json.image ?? ''),
      serial: String(json.serial ?? ''),
      status: String(json.status ?? StudentStatusEnum.ACTIVE) as StudentStatusEnum,
      points: Number(json.points ?? 0),
      rank: String(json.rank ?? ''),
      phone: String(json.phone ?? ''),
      educationType: educationValue(json.education_type),
      educationStage: titleValue(json.education_stage),
      grade: titleValue(json.grade),
      parentName: String(json.parent_name ?? ''),
      parentPhone: String(json.parent_phone ?? ''),
      reason: String(json.reason ?? ''),
      blockedBy:
        Object.keys(blockedBy).length > 0
          ? { id: Number(blockedBy.id ?? 0), name: String(blockedBy.name ?? '') }
          : null,
      blockDate: String(json.block_date ?? ''),
      registration: {
        registerDate: String(registration.register_date ?? ''),
        authenticationMethod: String(registration.authentication_method ?? ''),
        email: String(registration.email ?? ''),
        emailVerified: Boolean(registration.email_verified),
        phoneVerified: Boolean(registration.phone_verified),
      },
      applicationInformation: {
        registrationMethod: String(application.registration_method ?? ''),
        deviceUsed: String(application.device_used ?? ''),
        operationSystem: String(application.operation_system ?? ''),
        appVersion: String(application.app_version ?? ''),
        currentStatus: String(application.current_status ?? ''),
        lastSeen: String(application.last_seen ?? ''),
      },
      plan:
        planTitle && Object.keys(planJson).length > 0
          ? {
              ...planTitle,
              planStatus: String(
                planJson.plan_status ?? StudentStatusEnum.ACTIVE,
              ) as StudentStatusEnum,
              totalPaid: Number(planJson.total_paid ?? 0),
              paymentMethod: String(planJson.payment_method ?? ''),
              subscribeDate: String(planJson.subscribe_date ?? ''),
              expireDate: String(planJson.expire_date ?? ''),
            }
          : null,
      performance: {
        totalPlacementTests: Number(performance.total_placement_tests ?? 0),
        placementTestsThisMonth: Number(performance.placement_tests_this_month ?? 0),
        totalPracticesPlan: Number(performance.total_practices_plan ?? 0),
        totalPracticesPlanThisMonth: Number(performance.total_practices_plan_this_month ?? 0),
      },
      placementTests: resultList(json.placement_tests),
      practicesPlan: resultList(json.practices_plan),
      studentSchedules: Array.isArray(json.student_schedules)
        ? json.student_schedules
        : Array.isArray(json['Student schedules'])
          ? json['Student schedules']
          : [],
      notes: Array.isArray(json.notes)
        ? json.notes.map((item) => {
            const note = objectValue(item);
            const createdBy = objectValue(note.created_by);
            return {
              id: Number(note.id ?? 0),
              note: String(note.note ?? ''),
              createdAt: String(note.created_at ?? ''),
              createdBy:
                Object.keys(createdBy).length > 0
                  ? { id: Number(createdBy.id ?? 0), name: String(createdBy.name ?? '') }
                  : null,
            };
          })
        : [],
      subjects: Array.isArray(json.student_subjects)
        ? json.student_subjects.map((item) => {
            const subject = objectValue(item);
            return {
              id: Number(subject.id ?? 0),
              title: String(subject.title ?? ''),
            };
          })
        : [],
    });
  }

  static readonly example = ShowStudentModel.fromJson({
    id: 1,
    name: 'Ahmed Hawam',
    image: '',
    serial: 'Stu-001',
    status: StudentStatusEnum.ACTIVE,
    points: 1200,
    rank: 'Golden Rank',
    phone: '+2010203040',
    education_type: {
      id: 1,
      title: 'Basic Education',
      children: [{ id: 2, title: 'Primary', children: [] }],
    },
    education_stage: { id: 2, title: 'Primary' },
    grade: { id: 3, title: 'First' },
    parent_name: 'Hawam Ali',
    parent_phone: '+20 100 234 5678',
    registration: {
      register_date: '09 May 2022, 10:30 AM',
      authentication_method: 'Phone Number',
      email: '',
      email_verified: false,
      phone_verified: true,
    },
    application_information: {
      registration_method: 'Mobile App',
      device_used: 'iPhone 13',
      operation_system: 'iOS 18',
      app_version: '2.4.1',
      current_status: 'Offline',
      last_seen: 'Today, 09:15 AM',
    },
    plan: {
      id: 1,
      title: 'Premium',
      plan_status: StudentStatusEnum.ACTIVE,
      total_paid: 1000,
      payment_method: 'Card',
      subscribe_date: '09 May 2022',
      expire_date: '09 May 2023',
    },
    performance: {
      total_placement_tests: 20,
      placement_tests_this_month: 8,
      total_practices_plan: 20,
      total_practices_plan_this_month: 8,
    },
    placement_tests: [{ id: 1, title: 'Arabic', correct_count: 240, wrong_count: 60 }],
    practices_plan: [{ id: 1, title: 'Arabic', correct_count: 240, wrong_count: 60 }],
    student_schedules: Array.from({ length: 14 }),
    notes: [
      {
        id: 1,
        note: 'This plan included unlimited access to all premium features.',
        created_at: '5 July 2026, 3:20 pm',
        created_by: { id: 1, name: 'Amira Ahmed' },
      },
    ],
    subjects: [{ id: 1, title: 'Arabic' } , { id: 1, title: 'Arabic' } , { id: 1, title: 'Arabic' }, { id: 1, title: 'Arabic' }, { id: 1, title: 'Arabic' }, { id: 1, title: 'Arabic' }],
  });
}
