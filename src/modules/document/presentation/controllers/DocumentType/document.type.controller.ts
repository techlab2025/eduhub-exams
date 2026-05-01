import BaseController from '@/base/Presentation/Controller/baseController';
import type { ControllerConfig } from '@/base/Presentation/Controller/baseController';
import type DocumentModel from '@/modules/document/core/models/document.model';

import DocumentTypeRepository from '@/modules/document/data/repositories/DocumentType/document.type.repository';

export default class DocumentTypeController extends BaseController<DocumentModel, DocumentModel[]> {
  private static instance: DocumentTypeController;

  protected get repository() {
    return DocumentTypeRepository.getInstance();
  }

  protected get config(): ControllerConfig {
    return {
      showLoadingDialog: true,
      showSuccessDialog: true,
      showErrorDialog: true,
      autoRetry: false,
      maxAutoRetries: 1,
    };
  }

  private constructor() {
    super();
  }

  static getInstance(): DocumentTypeController {
    if (!DocumentTypeController.instance) {
      DocumentTypeController.instance = new DocumentTypeController();
    }
    return DocumentTypeController.instance;
  }
}
