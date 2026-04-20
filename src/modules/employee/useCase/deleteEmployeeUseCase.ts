import type { DataState } from "@/base/Core/NetworkStructure/Resources/dataState/dataState";
import type Params from "@/base/Core/Params/params";
import type IEmployeeRepo from "../domain/repositories/employee.repo";

export default class DeleteEmployeeUseCase {
  constructor(private readonly repo: IEmployeeRepo) {}

  async execute(params: Params): Promise<DataState<void>> {
    return await this.repo.delete(params);
  }
}
