import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { env } from '@/base/Core/Config';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import PlcaementTestModel from '../../../core/models/placement.test.model';
import PlacementStudentProfileModel from '../../../core/models/placement.student.profile.model';
import ShowPlacementStudentParams from '../../../core/params/show.placement.student.params';
import PlacementTestRepository from '../placement.test.repository';

describe('PlacementTestRepository', () => {
  const apiResponse = {
    statusCode: 200,
    data: {
      status: true,
      message: 'Placement tests fetched successfully',
      data: {
        data: [
          {
            id: 1,
            exam_id: 1,
            student: {
              id: 7,
              name: '7omsa',
              image: '',
              created_at: '2026-08-05 07:13:36',
            },
            result: null,
            e_c_subject: {
              id: 284,
              e_c_subject_id: 284,
              title: 'mostafa 2',
              full_title: 'mostafa 1 -> mostafa 2',
              children: [],
            },
            e_c_branch: {
              id: 361,
              e_c_branch_id: 361,
              title: 'mostafa 1',
              full_title: 'mostafa 1',
            },
            number_of_questions: 1,
            status: 'pending',
            in_plan: false,
            date: '2026-08-05',
          },
        ],
        links: {},
        meta: {
          current_page: 1,
          from: 1,
          last_page: 1,
          per_page: 10,
          to: 1,
          total: 1,
        },
      },
    },
  };

  let repository: PlacementTestRepository;

  beforeEach(() => {
    repository = PlacementTestRepository.getInstance();
    vi.spyOn(repository as unknown as { apiService: unknown }, 'apiService', 'get').mockReturnValue(
      {
        index: vi.fn().mockResolvedValue(apiResponse),
        showStudentProfile: vi.fn().mockResolvedValue({
          statusCode: 200,
          data: {
            status: true,
            message: 'Student profile fetched successfully',
            data: {
              id: 1,
              student: { id: 7, name: 'Ahmed', image: '' },
              student_code: 'ST-7',
              exam_performance: [],
              skill_progress: [],
              plan_markers: [],
              exam_history: [],
            },
          },
        }),
      },
    );
    env.override({ useStaticData: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    env.reset();
  });

  it('parses placement list rows with the list model', async () => {
    const result = await repository.index();

    expect(result).toBeInstanceOf(DataSuccess);
    if (result instanceof DataSuccess) {
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0]).toBeInstanceOf(PlcaementTestModel);
      expect(result.data?.[0].student?.name).toBe('7omsa');
      expect(result.data?.[0].EducationClassificationSubject?.title).toBe('mostafa 2');
      expect(result.data?.[0].numberOfQuestions).toBe(1);
      expect(result.data?.[0].in_plan).toBe(false);
    }
  });

  it('parses the student profile through the placement repository', async () => {
    const result = await repository.showStudentProfile(new ShowPlacementStudentParams(7));

    expect(result).toBeInstanceOf(DataSuccess);
    if (result instanceof DataSuccess) {
      expect(result.data).toBeInstanceOf(PlacementStudentProfileModel);
      expect(result.data?.placementTest.student?.id).toBe(7);
    }
  });
});
