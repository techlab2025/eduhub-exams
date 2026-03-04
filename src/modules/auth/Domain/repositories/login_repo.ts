import { LoginApiService } from '@/features/auth/Data/api_services/login_api_service'
import UserModel from '@/features/auth/Data/models/user_model'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'

class LoginRepo extends RepoInterface<UserModel> {
  private static instance: LoginRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new LoginRepo()
    }
    return this.instance
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return LoginApiService.getInstance();
  }
}

export { LoginRepo }
