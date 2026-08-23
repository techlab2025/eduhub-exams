import type TitleInterface from '@/base/Data/Models/titleInterface';
import { StudentStatusEnum, type StudentTitleModel } from './student.model';
import StudentApplicationModel from './student.application.model';
import { StudentEducationModel } from './student.education.model';
import StudentNoteModel from './student.note.model';
import StudentPerformanceModel from './student.performance.model';
import StudentPlanModel from './student.plan.model';
import StudentRegistrationModel from './student.registration.model';
import StudentResultModel from './student.result.model';

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

  private constructor(data: {
    id: number;
    name: string;
    image: string;
    serial: string;
    status: StudentStatusEnum;
    points: number;
    rank: string;
    phone: string;
    educationType: StudentEducationModel | null;
    educationStage: StudentTitleModel | null;
    grade: StudentTitleModel | null;
    parentName: string;
    parentPhone: string;
    reason: string;
    blockedBy: { id: number; name: string } | null;
    blockDate: string;
    registration: StudentRegistrationModel;
    applicationInformation: StudentApplicationModel;
    plan: StudentPlanModel | null;
    performance: StudentPerformanceModel;
    placementTests: StudentResultModel[];
    practicesPlan: StudentResultModel[];
    studentSchedules: unknown[];
    notes: StudentNoteModel[];
    subjects: TitleInterface<string>[];
  }) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.serial = data.serial;
    this.status = data.status;
    this.points = data.points;
    this.rank = data.rank;
    this.phone = data.phone;
    this.educationType = data.educationType;
    this.educationStage = data.educationStage;
    this.grade = data.grade;
    this.parentName = data.parentName;
    this.parentPhone = data.parentPhone;
    this.reason = data.reason;
    this.blockedBy = data.blockedBy;
    this.blockDate = data.blockDate;
    this.registration = data.registration;
    this.applicationInformation = data.applicationInformation;
    this.plan = data.plan;
    this.performance = data.performance;
    this.placementTests = data.placementTests;
    this.practicesPlan = data.practicesPlan;
    this.studentSchedules = data.studentSchedules;
    this.notes = data.notes;
    this.subjects = data.subjects;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): ShowStudentModel {
    const registration = objectValue(json.registration);
    const application = objectValue(json.application_information);
    const planJson = objectValue(json.plan);
    const performance = objectValue(json.performance);
    const blockedBy = objectValue(json.blocked_by);
    // const planTitle = titleValue(json.plan);

    return new ShowStudentModel({
      id: Number(json.id ?? json.student_id ?? 0),
      name: String(json.name ?? ''),
      image: String(json.image ?? ''),
      serial: String(json.serial ?? ''),
      status: String(json.status ?? StudentStatusEnum.ACTIVE) as StudentStatusEnum,
      points: Number(json.points ?? 0),
      rank: String(json.rank ?? ''),
      phone: String(json.phone ?? ''),
      educationType: StudentEducationModel.fromJson(json.education_type ?? {}),
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
      registration: StudentRegistrationModel.fromJson(registration),
      applicationInformation: StudentApplicationModel.fromJson(application),
      plan: StudentPlanModel.fromJson(planJson),
      performance: StudentPerformanceModel.fromJson(performance),
      // placementTests: resultList(json.placement_tests),
      placementTests: Array.isArray(json.placement_tests)
        ? json.placement_tests.map((item) => StudentResultModel.fromJson(item))
        : [],
      // practicesPlan: resultList(json.practices_plan),
      practicesPlan: Array.isArray(json.practices_plan)
        ? json.practices_plan.map((item) => StudentResultModel.fromJson(item))
        : [],
      studentSchedules: Array.isArray(json.student_schedules)
        ? json.student_schedules
        : Array.isArray(json['Student schedules'])
          ? json['Student schedules']
          : [],
      notes: Array.isArray(json.notes)
        ? json.notes.map((item) => StudentNoteModel.fromJson(item))
        : [],
      subjects: Array.isArray(json.subjects)
        ? json.subjects.map((item) => {
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
    education_type: StudentEducationModel.example,
    education_stage: { id: 2, title: 'Primary' },
    grade: { id: 3, title: 'First' },
    parent_name: 'Hawam Ali',
    parent_phone: '+20 100 234 5678',
    registration: StudentRegistrationModel.example,
    application_information: StudentApplicationModel.example,
    plan: StudentPlanModel.example,
    performance: StudentPerformanceModel.example,
    placement_tests: [StudentResultModel.example, StudentResultModel.example],
    practices_plan: [StudentResultModel.example, StudentResultModel.example],
    student_schedules: Array.from({ length: 14 }),
    notes: [StudentNoteModel.example, StudentNoteModel.example, StudentNoteModel.example],
    subjects: [
      { id: 1, title: 'Arabic' },
      { id: 1, title: 'Arabic' },
      { id: 1, title: 'Arabic' },
      { id: 1, title: 'Arabic' },
      { id: 1, title: 'Arabic' },
      { id: 1, title: 'Arabic' },
    ],
  });
}
