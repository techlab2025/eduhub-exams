import { beforeEach, expect, it, vi } from 'vitest';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import ShowStudentModel from '../../../core/models/show.student.model';
import { ShowStudentParams } from '../../../core/params/show.student.params';
import Controller from '../student.controller';

const mocks = vi.hoisted(() => ({
  show: vi.fn(),
}));

vi.mock('../../../data/repositories/student.repository', () => ({
  default: {
    getInstance: () => ({
      show: mocks.show,
    }),
  },
}));

beforeEach(() => {
  mocks.show.mockReset();
  mocks.show.mockResolvedValue(new DataSuccess({ data: ShowStudentModel.example }));
});

it('uses a singleton controller', () =>
  expect(Controller.getInstance()).toBe(Controller.getInstance()));

it('fetches student details from the API instead of static example data', async () => {
  const params = new ShowStudentParams(17);

  await Controller.getInstance().fetchOne(params);

  expect(mocks.show).toHaveBeenCalledOnce();
  expect(mocks.show.mock.calls[0][0]).toBe(params);
  expect(mocks.show.mock.calls[0][1]).toMatchObject({ useStaticData: false });
});
