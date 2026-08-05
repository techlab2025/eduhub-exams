import ShowPlcaementTestModel from './show.placement.test.model';
import StudentExamAnalysisModel from './subModels/studentProfile/student.exam.analysis.model';
import StudentExamHistoryModel from './subModels/studentProfile/student.exam.history.model';
import StudentExamPerformanceModel from './subModels/studentProfile/student.exam.performance.model';
import StudentPerformanceSnapshotModel from './subModels/studentProfile/student.performance.snapshot.model';
import StudentPlanMarkerModel from './subModels/studentProfile/student.plan.marker.model';
import StudentSkillProgressModel from './subModels/studentProfile/student.skill.progress.model';

export default class PlacementStudentProfileModel {
  public readonly placementTest: ShowPlcaementTestModel;
  public readonly studentCode?: string;
  public readonly studentStatus?: string;
  public readonly classificationPath: string[];
  public readonly enrolledSince?: string;
  public readonly parentName?: string;
  public readonly parentPhone?: string;
  public readonly foresightMessage?: string;
  public readonly declinePercentage?: number;
  public readonly declineSubject?: string;
  public readonly performanceSnapshot?: StudentPerformanceSnapshotModel;
  public readonly examAnalysis?: StudentExamAnalysisModel;
  public readonly examPerformance: StudentExamPerformanceModel[];
  public readonly selectedSkill?: string;
  public readonly skillProgress: StudentSkillProgressModel[];
  public readonly planMarkers: StudentPlanMarkerModel[];
  public readonly examHistory: StudentExamHistoryModel[];

  constructor(data: {
    placementTest: ShowPlcaementTestModel;
    studentCode?: string;
    studentStatus?: string;
    classificationPath: string[];
    enrolledSince?: string;
    parentName?: string;
    parentPhone?: string;
    foresightMessage?: string;
    declinePercentage?: number;
    declineSubject?: string;
    performanceSnapshot?: StudentPerformanceSnapshotModel;
    examAnalysis?: StudentExamAnalysisModel;
    examPerformance: StudentExamPerformanceModel[];
    selectedSkill?: string;
    skillProgress: StudentSkillProgressModel[];
    planMarkers: StudentPlanMarkerModel[];
    examHistory: StudentExamHistoryModel[];
  }) {
    this.placementTest = data.placementTest;
    this.studentCode = data.studentCode;
    this.studentStatus = data.studentStatus;
    this.classificationPath = data.classificationPath;
    this.enrolledSince = data.enrolledSince;
    this.parentName = data.parentName;
    this.parentPhone = data.parentPhone;
    this.foresightMessage = data.foresightMessage;
    this.declinePercentage = data.declinePercentage;
    this.declineSubject = data.declineSubject;
    this.performanceSnapshot = data.performanceSnapshot;
    this.examAnalysis = data.examAnalysis;
    this.examPerformance = data.examPerformance;
    this.selectedSkill = data.selectedSkill;
    this.skillProgress = data.skillProgress;
    this.planMarkers = data.planMarkers;
    this.examHistory = data.examHistory;
    Object.freeze(this);
  }

  static fromJson(json: any): PlacementStudentProfileModel {
    if (!json) throw new Error('Cannot create PlacementStudentProfileModel from empty data');

    return new PlacementStudentProfileModel({
      placementTest: ShowPlcaementTestModel.fromJson(json),
      studentCode: json.student_code,
      studentStatus: json.student_status,
      classificationPath: json.classification_path ?? [],
      enrolledSince: json.enrolled_since,
      parentName: json.parent_name,
      parentPhone: json.parent_phone,
      foresightMessage: json.foresight_message,
      declinePercentage: json.decline_percentage,
      declineSubject: json.decline_subject,
      performanceSnapshot: json.performance_snapshot
        ? StudentPerformanceSnapshotModel.fromJson(json.performance_snapshot)
        : undefined,
      examAnalysis: json.exam_analysis
        ? StudentExamAnalysisModel.fromJson(json.exam_analysis)
        : undefined,
      examPerformance: Array.isArray(json.exam_performance)
        ? json.exam_performance.map((item: any) => StudentExamPerformanceModel.fromJson(item))
        : [],
      selectedSkill: json.selected_skill,
      skillProgress: Array.isArray(json.skill_progress)
        ? json.skill_progress.map((item: any) => StudentSkillProgressModel.fromJson(item))
        : [],
      planMarkers: Array.isArray(json.plan_markers)
        ? json.plan_markers.map((item: any) => StudentPlanMarkerModel.fromJson(item))
        : [],
      examHistory: Array.isArray(json.exam_history)
        ? json.exam_history.map((item: any) => StudentExamHistoryModel.fromJson(item))
        : [],
    });
  }

  static example = new PlacementStudentProfileModel({
    placementTest: ShowPlcaementTestModel.example,
    studentCode: 'Stu-001',
    studentStatus: 'active',
    classificationPath: ['Governmental', 'Primary', 'First'],
    enrolledSince: 'September 2022',
    parentName: 'Hawam Ali',
    parentPhone: '+20 100 234 5678',
    foresightMessage: 'Student shows strong mastery in Science but needs support in Mathematics.',
    declinePercentage: 15,
    declineSubject: 'Mathematics',
    performanceSnapshot: StudentPerformanceSnapshotModel.example,
    examAnalysis: StudentExamAnalysisModel.example,
    examPerformance: StudentExamPerformanceModel.examples,
    selectedSkill: 'Reading Skill',
    skillProgress: StudentSkillProgressModel.examples,
    planMarkers: StudentPlanMarkerModel.examples,
    examHistory: StudentExamHistoryModel.examples,
  });
}
