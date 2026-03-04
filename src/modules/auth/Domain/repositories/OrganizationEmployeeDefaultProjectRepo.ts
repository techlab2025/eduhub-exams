import UserModel from '@/features/auth/Data/models/user_model'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { OrganizationEmployeeDefaultProjectApiService } from '../../Data/api_services/OrganizationEmployeeDefaultProjectApiService'

class OrganizationEmployeeDefaultProjectRepo extends RepoInterface<UserModel> {
  private static instance: OrganizationEmployeeDefaultProjectRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new OrganizationEmployeeDefaultProjectRepo()
    }
    return this.instance
  }

  onParse(data: any): UserModel {
    return UserModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return OrganizationEmployeeDefaultProjectApiService.getInstance()
  }
}

export { OrganizationEmployeeDefaultProjectRepo }
