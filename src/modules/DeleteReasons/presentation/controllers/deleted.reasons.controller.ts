import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type DeleteResonsModel from '../../core/models/delete.reasons.model';
import DeleteReasonesRepository from '../../data/repositories/delete.reasons.repository';

/**
 * Country Controller for managing countries
 *
 * This controller provides methods for CRUD operations on countries.
 */
export default class DeletedReasonsController extends BaseController<
  DeleteResonsModel,
  DeleteResonsModel[]
> {
  private static instance: DeletedReasonsController;

  protected get repository() {
    return DeleteReasonesRepository.getInstance();
  }

  /**
   * Controller configuration
   * Defines behavior for loading, success, and error dialogs
   */
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
  }

  /**
   * Get singleton instance
   * @returns CountryController instance
   */
  static getInstance(): DeletedReasonsController {
    if (!DeletedReasonsController.instance) {
      DeletedReasonsController.instance = new DeletedReasonsController();
    }
    return DeletedReasonsController.instance;
  }
}
