import { describe, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import PlacementStudentProfileModel from '../../../core/models/placement.student.profile.model';
import ShowPlacementStudentParams from '../../../core/params/show.placement.student.params';
import PlacementTestRepository from '../../../data/repositories/placement.test.repository';
import PlacementTestController from '../placement.test.controller';

describe('PlacementTestController', () => {
  it('stores student profile data in its dedicated state', async () => {
    const result = new DataSuccess({ data: PlacementStudentProfileModel.example });
    vi.spyOn(PlacementTestRepository.getInstance(), 'showStudentProfile').mockResolvedValue(result);
    const controller = PlacementTestController.getInstance();

    await controller.fetchStudentProfile(new ShowPlacementStudentParams(7));

    expect(controller.studentProfileState.value).toBeInstanceOf(DataSuccess);
    expect(controller.studentProfileState.value.data).toBe(PlacementStudentProfileModel.example);
  });
});
