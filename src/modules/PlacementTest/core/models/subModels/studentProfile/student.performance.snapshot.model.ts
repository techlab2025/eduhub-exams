export default class StudentPerformanceSnapshotModel {
  public readonly currentPlan?: string;
  public readonly planExpiresAt?: string;
  public readonly totalExams?: number;
  public readonly examsThisMonth?: number;
  public readonly totalPlansCreated?: number;
  public readonly plansThisMonth?: number;

  constructor(data: {
    currentPlan?: string;
    planExpiresAt?: string;
    totalExams?: number;
    examsThisMonth?: number;
    totalPlansCreated?: number;
    plansThisMonth?: number;
  }) {
    this.currentPlan = data.currentPlan;
    this.planExpiresAt = data.planExpiresAt;
    this.totalExams = data.totalExams;
    this.examsThisMonth = data.examsThisMonth;
    this.totalPlansCreated = data.totalPlansCreated;
    this.plansThisMonth = data.plansThisMonth;
    Object.freeze(this);
  }

  static fromJson(json: any): StudentPerformanceSnapshotModel {
    return new StudentPerformanceSnapshotModel({
      currentPlan: json.current_plan,
      planExpiresAt: json.plan_expires_at,
      totalExams: json.total_exams,
      examsThisMonth: json.exams_this_month,
      totalPlansCreated: json.total_plans_created,
      plansThisMonth: json.plans_this_month,
    });
  }

  static example = new StudentPerformanceSnapshotModel({
    currentPlan: 'Premium',
    planExpiresAt: '9 May 2027',
    totalExams: 20,
    examsThisMonth: 5,
    totalPlansCreated: 8,
    plansThisMonth: 4,
  });
}
