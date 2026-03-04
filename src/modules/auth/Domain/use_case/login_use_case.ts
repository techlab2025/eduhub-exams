import type Params from '@/base/core/params/params'
import type UserModel from '@/features/auth/Data/models/user_model'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { LoginRepo } from '@/features/auth/Domain/repositories/login_repo'

export default class LoginUseCase implements UseCase<UserModel, Params> {
  async call(params: Params): Promise<DataState<UserModel>> {
    return LoginRepo.getInstance().call(params)
  }
}
