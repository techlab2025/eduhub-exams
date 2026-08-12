export default class StudentStatsModel {
  public readonly totalStudents: number;
  public readonly activeStudents: number;
  public readonly archivedStudents: number;
  public readonly blockedStudents: number;

  constructor(data: {
    totalStudents: number;
    activeStudents: number;
    archivedStudents: number;
    blockedStudents: number;
  }) {
    this.totalStudents = data.totalStudents;
    this.activeStudents = data.activeStudents;
    this.archivedStudents = data.archivedStudents;
    this.blockedStudents = data.blockedStudents;
    Object.freeze(this);
  }

  static statsFromJson(json: Record<string, unknown>): StudentStatsModel {
    return new StudentStatsModel({
      totalStudents: Number(json.total_students ?? 0),
      activeStudents: Number(json.active_students ?? 0),
      archivedStudents: Number(json.archive_students ?? 0),
      blockedStudents: Number(json.blocked_students ?? 0),
    });
  }

  static readonly example = new StudentStatsModel({
    totalStudents: 2543,
    activeStudents: 2000,
    archivedStudents: 250,
    blockedStudents: 100,
  });
}
