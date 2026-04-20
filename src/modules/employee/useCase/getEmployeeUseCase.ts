import type { DataState } from "@/base/Core/NetworkStructure/Resources/dataState/dataState";
import type Params from "@/base/Core/Params/params";
import type EmployeeModel from "../core/models/employee.model";
import type IEmployeeRepo from "../domain/repositories/employee.repo";

export default class GetEmployeeUseCase {
  constructor(private readonly repo: IEmployeeRepo) {}

  async execute(params: Params): Promise<DataState<EmployeeModel>> {
    return await this.repo.show(params);
  }
}
