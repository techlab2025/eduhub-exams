import { describe, expect, it } from 'vitest';
import StudentStatsModel from '../student.stats.model';

describe('StudentStatsModel', () => {
  it('maps the documented student statistics response', () => {
    expect(
      StudentStatsModel.statsFromJson({
        total_students: 2543,
        active_students: 2000,
        archive_students: 250,
        blocked_students: 100,
      }),
    ).toMatchObject({
      totalStudents: 2543,
      activeStudents: 2000,
      archivedStudents: 250,
      blockedStudents: 100,
    });
  });
});
