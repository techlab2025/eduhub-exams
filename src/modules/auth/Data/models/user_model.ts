import LangModel from '@/features/setting/languages/Data/models/langModel'
import { OrganizationTypeEnum } from '../../Core/Enum/organization_type'
import { EmployeeStatusEnum } from '@/features/Organization/OrganizationEmployee/Core/Enum/EmployeeStatus'
import type ProjectDetailsModel from '@/features/Organization/Project/Data/models/ProjectDetailsModel'
import type TitleInterface from '@/base/Data/Models/title_interface'

export default class UserModel {
  public id: number
  public name: string // Use 'string' instead of 'String'
  public email: string // Use 'string' instead of 'String'
  public image: string
  public employeeType: EmployeeStatusEnum
  public phone?: string
  public isMaster?: number
  public firstName?: string
  public lastName?: string
  public apiToken: string
  public aboutMe?: string
  public sendNotifications?: boolean
  public facebook?: string
  public x?: string
  public instagram?: string
  public youtube?: string
  public linkedin?: string
  public whatsapp?: string
  public languages: LangModel[] = []
  public type: OrganizationTypeEnum = OrganizationTypeEnum.ADMIN
  public permission: string[] = []
  public Defaultproject?: TitleInterface
  public organizationName?: string
  public WebSocketToken?: string

  constructor(
    id: number,
    name: string,
    email: string,
    apiToken: string,
    image: string,
    employeeType: EmployeeStatusEnum,
    phone?: string,
    isMaster?: number,
    firstName?: string,
    lastName?: string,
    aboutMe?: string,
    sendNotifications?: boolean,
    facebook?: string,
    x?: string,
    instagram?: string,
    youtube?: string,
    linkedin?: string,
    whatsapp?: string,
    languages: LangModel[] = [],
    type: OrganizationTypeEnum = OrganizationTypeEnum.ADMIN,
    permission: string[] = [],
    Defaultproject?: TitleInterface,
    organizationName?: string,
    WebSocketToken?: string,
  ) {
    this.id = id
    this.name = name
    this.email = email
    this.image = image
    this.employeeType = employeeType
    this.firstName = firstName
    this.lastName = lastName
    this.phone = phone
    this.isMaster = isMaster
    this.apiToken = apiToken
    this.aboutMe = aboutMe
    this.sendNotifications = sendNotifications
    this.facebook = facebook
    this.x = x
    this.instagram = instagram
    this.youtube = youtube
    this.linkedin = linkedin
    this.whatsapp = whatsapp
    this.languages = languages
    this.type = type
    this.permission = permission
    this.Defaultproject = Defaultproject
    this.organizationName = organizationName
    this.WebSocketToken = WebSocketToken
  }

  static fromMap(map: { [key: string]: any }): UserModel {
    return new UserModel(
      map['id'],
      map['name'],
      map['email'],
      map['api_token'],
      map['image'],
      map['employee_type'],
      map['phone'],
      map['is_master'],
      map['first_name'],
      map['last_name'],
      map['about_me'],
      map['send_notifications'],
      map['facebook'],
      map['x'],
      map['instagram'],
      map['youtube'],
      map['linkedin'],
      map['whatsapp'],
      map['languages']?.map((lang: any) => LangModel.fromMap(lang)),
      map['type'],
      map['permissions'],
      map['default_project'],
      map['organization_name'],
      map['notification_token'],
    )
  }
}
