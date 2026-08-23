export default class StudentPerformanceModel {
  public readonly totalPlacementTests!: number;
  public readonly placementTestsThisMonth!: number;
  public readonly totalPracticesPlan!: number;
  public readonly totalPracticesPlanThisMonth!: number;

  constructor(data: {
    totalPlacementTests: number;
    placementTestsThisMonth: number;
    totalPracticesPlan: number;
    totalPracticesPlanThisMonth: number;
  }) {
    this.totalPlacementTests = data.totalPlacementTests;
    this.placementTestsThisMonth = data.placementTestsThisMonth;
    this.totalPracticesPlan = data.totalPracticesPlan;
    this.totalPracticesPlanThisMonth = data.totalPracticesPlanThisMonth;
    Object.freeze(this);
  }

  static fromJson(json: Record<string, unknown>): StudentPerformanceModel {
    return new StudentPerformanceModel({
      totalPlacementTests: Number(json.total_placement_tests ?? 0),
      placementTestsThisMonth: Number(json.placement_tests_this_month ?? 0),
      totalPracticesPlan: Number(json.total_practices_plan ?? 0),
      totalPracticesPlanThisMonth: Number(json.total_practices_plan_this_month ?? 0),
    });
  }

  static readonly example = StudentPerformanceModel.fromJson({
    total_placement_tests: 0,
    placement_tests_this_month: 0,
    total_practices_plan: 0,
    total_practices_plan_this_month: 0,
  });
}
