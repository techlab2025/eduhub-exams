import BaseController from "@/base/Presentation/Controller/baseController";
import type { ControllerConfig } from "@/base/Presentation/Controller/baseController";
import EmployeeModel from "../../core/models/employee.model";
import EmployeeRepository from "../../data/repositories/employee.repository";
import type { ApiCallOptions } from "@/base/Data/ApiService/baseApiService";
import type Params from "@/base/Core/Params/params";
import { DataSuccess } from "@/base/Core/NetworkStructure/Resources/dataState/dataState";
import router from "@/router";
import { useFormsStore } from "@/stores/formsStore";

// UseCases
import GetEmployeesUseCase from "../../useCase/getEmployeesUseCase";
import GetEmployeeUseCase from "../../useCase/getEmployeeUseCase";
import CreateEmployeeUseCase from "../../useCase/createEmployeeUseCase";
import UpdateEmployeeUseCase from "../../useCase/updateEmployeeUseCase";
import DeleteEmployeeUseCase from "../../useCase/deleteEmployeeUseCase";

/**
 * Employee Controller for managing employees
 */
export default class EmployeeController extends BaseController<
  EmployeeModel,
  EmployeeModel[]
> {
  private static instance: EmployeeController;

  // UseCase instances
  private readonly getEmployeesUseCase: GetEmployeesUseCase;
  private readonly getEmployeeUseCase: GetEmployeeUseCase;
  private readonly createEmployeeUseCase: CreateEmployeeUseCase;
  private readonly updateEmployeeUseCase: UpdateEmployeeUseCase;
  private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase;

  protected get repository() {
    return EmployeeRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: true,
      showSuccessDialog: true,
      showErrorDialog: true,
      autoRetry: true,
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
    const repo = this.repository;
    this.getEmployeesUseCase = new GetEmployeesUseCase(repo);
    this.getEmployeeUseCase = new GetEmployeeUseCase(repo);
    this.createEmployeeUseCase = new CreateEmployeeUseCase(repo);
    this.updateEmployeeUseCase = new UpdateEmployeeUseCase(repo);
    this.deleteEmployeeUseCase = new DeleteEmployeeUseCase(repo);
  }

  static getInstance(): EmployeeController {
    if (!EmployeeController.instance) {
      EmployeeController.instance = new EmployeeController();
    }
    return EmployeeController.instance;
  }

  // Override base methods to use UseCases
  async fetchList(params?: Params, options?: ApiCallOptions) {
    this.setListLoading();
    const result = await this.getEmployeesUseCase.execute(params);
    this.setListState(result);
    return result;
  }

  async fetchOne(params: Params, options?: ApiCallOptions) {
    this.setItemLoading();
    const result = await this.getEmployeeUseCase.execute(params);
    this.setItemState(result);
    return result;
  }

  async create(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();
    this.setItemLoading();
    const result = await this.createEmployeeUseCase.execute(params);
    if (result instanceof DataSuccess) {
      this.setItemState(result);
      router.push({ name: "Employees" });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    // Handle error state if needed (BaseController usually handles dialogs via handleItemResponse)
    // For consistency with BaseController behavior:
    return result;
  }

  async update(params: Params, options?: ApiCallOptions, formKey?: string) {
    const FormStore = useFormsStore();
    this.setItemLoading();
    const result = await this.updateEmployeeUseCase.execute(params);
    if (result instanceof DataSuccess) {
      this.setItemState(result);
      router.push({ name: "Employees" });
      if (formKey) {
        FormStore.clearFormData(formKey);
      }
    }
    return result;
  }

  async delete(params: Params, options?: ApiCallOptions) {
    const result = await this.deleteEmployeeUseCase.execute(params);
    return result;
  }
}
