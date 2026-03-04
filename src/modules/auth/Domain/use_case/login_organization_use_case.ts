import type Params from '@/base/core/params/params'
import type UserModel from '@/features/auth/Data/models/user_model'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { LoginOrganizationRepo } from '../repositories/login_organization_repo'

export default class LoginOrganizationUseCase implements UseCase<UserModel, Params> {
  async call(params: Params): Promise<DataState<UserModel>> {
    return LoginOrganizationRepo.getInstance().call(params)
  }
}
