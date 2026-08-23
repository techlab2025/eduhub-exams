import type TitleInterface from '@/base/Data/Models/titleInterface';
import { SaftyConditions } from '@/base/Presentation/Utils/SaftyConditions';
import { StudentStatusEnum, type StudentTitleModel } from './student.model';
import StudentApplicationModel from './student.application.model';
import { StudentEducationModel } from './student.education.model';
import StudentNoteModel from './student.note.model';
import StudentPerformanceModel from './student.performance.model';
import StudentPlanModel from './student.plan.model';
import StudentRegistrationModel from './student.registration.model';
import StudentResultModel from './student.result.model';

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
    const registration = SaftyConditions.modelValue(json.registration, StudentRegistrationModel);
    const application = SaftyConditions.modelValue(
      json.application_information,
      StudentApplicationModel,
    );
    const plan = SaftyConditions.nullableModelValue(json.plan, StudentPlanModel);
    const performance = SaftyConditions.modelValue(json.performance, StudentPerformanceModel);
    const blockedBy = SaftyConditions.objectValue(json.blocked_by);

    return new ShowStudentModel({
      id: Number(json.id ?? json.student_id ?? 0),
      name: String(json.name ?? ''),
      image: String(json.image ?? ''),
      serial: String(json.serial ?? ''),
      status: String(json.status ?? StudentStatusEnum.ACTIVE) as StudentStatusEnum,
      points: Number(json.points ?? 0),
      rank: String(json.rank ?? ''),
      phone: String(json.phone ?? ''),
      educationType: SaftyConditions.nullableModelValue(json.education_type, StudentEducationModel),
      educationStage: SaftyConditions.titleValueCheck(json.education_stage),
      grade: SaftyConditions.titleValueCheck(json.grade),
      parentName: String(json.parent_name ?? ''),
      parentPhone: String(json.parent_phone ?? ''),
      reason: String(json.reason ?? ''),
      blockedBy:
        Object.keys(blockedBy).length > 0
          ? { id: Number(blockedBy.id ?? 0), name: String(blockedBy.name ?? '') }
          : null,
      blockDate: String(json.block_date ?? ''),
      registration,
      applicationInformation: application,
      plan,
      performance,
      placementTests: SaftyConditions.modelListCheck(json.placement_tests, StudentResultModel),
      practicesPlan: SaftyConditions.modelListCheck(json.practices_plan, StudentResultModel),
      studentSchedules: Array.isArray(json.student_schedules)
        ? json.student_schedules
        : Array.isArray(json['Student schedules'])
          ? json['Student schedules']
          : [],
      notes: SaftyConditions.modelListCheck(json.notes, StudentNoteModel),
      subjects: Array.isArray(json.subjects)
        ? json.subjects.map((item) => {
            const subject = SaftyConditions.objectValue(item);
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
