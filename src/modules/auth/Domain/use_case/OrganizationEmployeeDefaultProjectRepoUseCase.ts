import type Params from '@/base/core/params/params'
import type UserModel from '@/features/auth/Data/models/user_model'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { OrganizationEmployeeDefaultProjectRepo } from '../repositories/OrganizationEmployeeDefaultProjectRepo'

export default class OrganizationEmployeeDefaultProjectRepoUseCase
  implements UseCase<UserModel, Params>
{
  async call(params: Params): Promise<DataState<UserModel>> {
    return OrganizationEmployeeDefaultProjectRepo.getInstance().call(params)
  }
}
