import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import UserModel from '@/features/auth/Data/models/user_model'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import LoginUseCase from '@/features/auth/Domain/use_case/login_use_case'
import { useUserStore } from '@/stores/user'
import errorImage from '@/assets/images/error.png'
import successImage from '@/assets/images/success-dialog.png'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import { OrganizationTypeEnum } from '../../Core/Enum/organization_type'
import LoginOrganizationUseCase from '../../Domain/use_case/login_organization_use_case'
import axios from 'axios'
import ConditionHandler from '@/base/Presentation/utils/condition_handler'
import { useProjectSelectStore } from '@/stores/ProjectSelect'

export default class LoginController extends ControllerInterface<UserModel> {
  private static instance: LoginController
  private constructor() {
    super()
  }
  private LoginUseCase = new LoginUseCase()
  private LoginOrganizationUseCase = new LoginOrganizationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new LoginController()
    }
    return this.instance
  }

  async login(params: Params, router: any, activeType: number) {
    try {
      this.setLoading()
      let dataState: DataState<UserModel>

      if (activeType === OrganizationTypeEnum.ADMIN) {
        dataState = await this.LoginUseCase.call(params)
      } else if (activeType === OrganizationTypeEnum.ORGANIZATION) {
        dataState = await this.LoginOrganizationUseCase.call(params)
      } else {
        throw new Error('Invalid user type')
      }

      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Login Success',
          imageElement: successImage,
          messageContent: null,
        })

        const userStore = useUserStore()
        const ProjectSelector = useProjectSelectStore()

        if (this.state.value.data) {
          userStore.setUser(this.state.value.data as UserModel)
          const apiToken = this.state.value.data.apiToken
          localStorage.setItem('token', JSON.stringify(apiToken))
          localStorage.setItem('user', JSON.stringify(this.state.value.data))
          axios.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`
          ProjectSelector.setProjectId(this.state.value.data.Defaultproject)
        }

        if (!ConditionHandler.getInstance().isOrganizationEmployee()) {
          await router.push({
            path: activeType === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization',
          })
        } else {
          // await router.push({
          //   path: activeType === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization',
          // })
          await router.push({
            path: '/organization/employee-interface',
          })
        }
      } else {
        throw new Error(this.state.value.error?.title ?? 'Unknown login error')
      }
    } catch (error: any) {
      console.log(this.state.value.error, 'errorsssss')
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: error?.message ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }
  }
}
