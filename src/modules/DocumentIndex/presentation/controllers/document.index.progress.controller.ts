import { computed, ref } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import GenerateDocumentIndexParams from '../../core/params/generate.document.index.params';
import DocumentIndexPatchController from './document.index.patch.controller';

export default class DocumentIndexProgressController {
  private static instance: DocumentIndexProgressController;
  private readonly patchController: DocumentIndexPatchController;
  private startRequestId = 0;

  public readonly startingDocumentId = ref<number>();
  public readonly manualProgressActive = ref(false);
  public readonly generationDialogVisible = ref(false);
  public readonly cancelConfirmationVisible = ref(false);
  public readonly hasActiveIndexing = computed(
    () => this.startingDocumentId.value != null || this.manualProgressActive.value,
  );

  private constructor() {
    this.patchController = DocumentIndexPatchController.getInstance();
  }

  static getInstance(): DocumentIndexProgressController {
    if (!DocumentIndexProgressController.instance) {
      DocumentIndexProgressController.instance = new DocumentIndexProgressController();
    }
    return DocumentIndexProgressController.instance;
  }

  async startIndex(documentId: number): Promise<boolean> {
    if (this.startingDocumentId.value != null) return false;

    const requestId = ++this.startRequestId;
    this.startingDocumentId.value = documentId;
    this.manualProgressActive.value = false;
    this.cancelConfirmationVisible.value = false;
    this.generationDialogVisible.value = true;

    try {
      const result = await this.patchController.startIndex(
        new GenerateDocumentIndexParams(documentId, false),
      );
      return (
        requestId === this.startRequestId && result instanceof DataSuccess && Boolean(result.data)
      );
    } finally {
      if (requestId === this.startRequestId) this.finishStartRequest();
    }
  }

  openProgress() {
    if (this.startingDocumentId.value == null) this.manualProgressActive.value = true;
    this.cancelConfirmationVisible.value = false;
    this.generationDialogVisible.value = true;
  }

  openActiveProgress() {
    if (this.hasActiveIndexing.value) this.openProgress();
  }

  minimize() {
    this.generationDialogVisible.value = false;
    this.cancelConfirmationVisible.value = false;
  }

  requestCancel() {
    this.cancelConfirmationVisible.value = true;
  }

  keepIndexing() {
    this.cancelConfirmationVisible.value = false;
  }

  confirmCancel() {
    this.startRequestId += 1;
    this.finishStartRequest();
  }

  reset() {
    this.startRequestId += 1;
    this.finishStartRequest();
  }

  private finishStartRequest() {
    this.startingDocumentId.value = undefined;
    this.manualProgressActive.value = false;
    this.generationDialogVisible.value = false;
    this.cancelConfirmationVisible.value = false;
  }
}
