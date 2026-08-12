import { describe, expect, it } from 'vitest';
import ShowStudentModel from '../show.student.model';

describe('ShowStudentModel', () => {
  it('maps the documented student details response', () => {
    const model = ShowStudentModel.fromJson({
      id: 4,
      name: 'Mona',
      points: 1200,
      plan: { id: 2, title: 'Premium', total_paid: 1000 },
      performance: { total_placement_tests: 20 },
      placement_tests: [{ id: 3, title: 'Arabic', correct_count: 24, wrong_count: 6 }],
      notes: [
        {
          id: 8,
          note: 'Private note',
          created_at: '2026-07-05',
          created_by: { id: 2, name: 'Admin' },
        },
      ],
    });

    expect(model).toMatchObject({
      id: 4,
      points: 1200,
      plan: { title: 'Premium', totalPaid: 1000 },
      performance: { totalPlacementTests: 20 },
      placementTests: [{ correctCount: 24, wrongCount: 6 }],
      notes: [{ note: 'Private note', createdBy: { name: 'Admin' } }],
    });
  });

  it('provides a complete example for the details page', () => {
    expect(ShowStudentModel.example.plan?.title).toBe('Premium');
    expect(ShowStudentModel.example.placementTests).toHaveLength(1);
    expect(ShowStudentModel.example.notes).toHaveLength(1);
  });
});
