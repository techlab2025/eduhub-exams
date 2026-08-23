import { describe, expect, it } from 'vitest';
import ShowStudentModel from '../show.student.model';

describe('ShowStudentModel', () => {
  it('maps the documented student details response', () => {
    const model = ShowStudentModel.fromJson({
      id: 4,
      name: 'Mona',
      image: 'student.png',
      serial: 'ST-4',
      status: '3',
      points: 1200,
      rank: 'Gold',
      phone: '+201000000000',
      education_type: {
        id: 1,
        title: 'National',
        children: [{ id: 2, title: 'Primary', children: [] }],
      },
      education_stage: { id: 2, title: 'Primary' },
      grade: { id: 3, title: 'First' },
      reason: 'Policy violation',
      blocked_by: { id: 9, name: 'Admin' },
      block_date: '2026-08-01',
      registration: {
        register_date: '2026-01-01',
        authentication_method: 'email',
        email: 'mona@example.com',
        email_verified: true,
        phone_verified: false,
      },
      application_information: {
        registration_method: 'mobile',
        device_used: 'iPhone',
        operation_system: 'iOS',
        app_version: '2.4.1',
        current_status: 'offline',
        last_seen: '2026-08-16',
      },
      plan: {
        id: 2,
        title: 'Premium',
        plan_status: '1',
        total_paid: 1000,
        payment_method: 'card',
        subscribe_date: '2026-01-01',
        expire_date: '2027-01-01',
      },
      performance: {
        total_placement_tests: 20,
        placement_tests_this_month: 3,
        total_practices_plan: 14,
        total_practices_plan_this_month: 4,
      },
      placement_tests: [{ id: 3, title: 'Arabic', correct_count: 24, wrong_count: 6 }],
      practices_plan: [{ id: 5, title: 'Math', correct_count: 18, wrong_count: 2 }],
      student_schedules: [{ id: 7 }],
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
      name: 'Mona',
      image: 'student.png',
      serial: 'ST-4',
      status: '3',
      points: 1200,
      rank: 'Gold',
      phone: '+201000000000',
      educationType: {
        id: 1,
        title: 'National',
        children: [{ id: 2, title: 'Primary', children: [] }],
      },
      educationStage: { id: 2, title: 'Primary' },
      grade: { id: 3, title: 'First' },
      reason: 'Policy violation',
      blockedBy: { id: 9, name: 'Admin' },
      blockDate: '2026-08-01',
      registration: {
        registerDate: '2026-01-01',
        authenticationMethod: 'email',
        email: 'mona@example.com',
        emailVerified: true,
        phoneVerified: false,
      },
      applicationInformation: {
        registrationMethod: 'mobile',
        deviceUsed: 'iPhone',
        operationSystem: 'iOS',
        appVersion: '2.4.1',
        currentStatus: 'offline',
        lastSeen: '2026-08-16',
      },
      plan: {
        id: 2,
        title: 'Premium',
        planStatus: '1',
        totalPaid: 1000,
        paymentMethod: 'card',
        subscribeDate: '2026-01-01',
        expireDate: '2027-01-01',
      },
      performance: {
        totalPlacementTests: 20,
        placementTestsThisMonth: 3,
        totalPracticesPlan: 14,
        totalPracticesPlanThisMonth: 4,
      },
      placementTests: [{ correctCount: 24, wrongCount: 6 }],
      practicesPlan: [{ id: 5, title: 'Math', correctCount: 18, wrongCount: 2 }],
      studentSchedules: [{ id: 7 }],
      notes: [{ note: 'Private note', createdBy: { name: 'Admin' } }],
    });
  });

  it('provides a complete example for the details page', () => {
    expect(ShowStudentModel.example.plan?.title).toBe('Premium');
    expect(ShowStudentModel.example.placementTests).toHaveLength(2);
    expect(ShowStudentModel.example.notes).toHaveLength(3);
  });
});
