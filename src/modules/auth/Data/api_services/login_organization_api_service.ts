import { ApiNames } from '@/base/core/networkStructure/apiNames'
import ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { CrudType } from '@/base/core/params/call_params_interface'
import type Params from '@/base/core/params/params'

class LoginOrganizationApiService extends ServicesInterface {
  private static instance: LoginOrganizationApiService
  // eslint-disable-next-line ~typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new LoginOrganizationApiService()
    }
    return this.instance
  }

  async applyService(params: Params): Promise<{ data: any; statusCode: number }> {
    // console.log(CrudType.POST)
    return await super.call({
      url: ApiNames.instance.AuthLoginOrganization,
      type: CrudType.POST,
      auth: false,
      params: params,
      showLoadingDialog: true,
    })
  }
}

export { LoginOrganizationApiService }
