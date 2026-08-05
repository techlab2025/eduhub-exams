import { describe, expect, it, vi } from 'vitest';
import PlacementApiService from '../placement.test.api-service';
import ShowPlacementStudentParams from '../../../core/params/show.placement.student.params';

describe('PlacementApiService', () => {
  it('uses the placement student endpoint from the existing api service', async () => {
    const service = PlacementApiService.getInstance();
    const customPost = vi.spyOn(service, 'customPost').mockResolvedValue({
      statusCode: 200,
      data: { status: true, data: {} },
    });
    const params = new ShowPlacementStudentParams(7);

    await service.showStudentProfile(params);

    expect(customPost).toHaveBeenCalledWith(
      expect.stringContaining('show_placement_test_student'),
      params,
      undefined,
    );
  });
});
