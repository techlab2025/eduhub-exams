import UserModel from '@/features/auth/Data/models/user_model'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { LoginOrganizationApiService } from '../../Data/api_services/login_organization_api_service'

class LoginOrganizationRepo extends RepoInterface<UserModel> {
  private static instance: LoginOrganizationRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new LoginOrganizationRepo()
    }
    return this.instance
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return LoginOrganizationApiService.getInstance();
  }
}

export { LoginOrganizationRepo }
