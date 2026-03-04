import type Params from '@/base/core/params/params'

export default class OrganizationEmployeeDefaultProjectParams implements Params {
  public organizationEmployeeId: string
  public defaultProjectId: string

  constructor(organizationEmployeeId: string, defaultProjectId: string) {
    this.organizationEmployeeId = organizationEmployeeId
    this.defaultProjectId = defaultProjectId
  }

  toMap(): { [key: string]: any } {
    const data: { [key: string]: any } = {}
    data['organization_employee_id'] = this.organizationEmployeeId
    data['default_project_id'] = this.defaultProjectId
    return data
  }
}
