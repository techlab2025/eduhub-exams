import { computed, ref, shallowRef } from 'vue';
import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
import {
  DocumentIndexPatchStatusEnum,
  type DocumentIndexPatchStatusEnum as DocumentIndexPatchStatus,
} from '../../core/constant/document.index.patch.status.enum';
import type DocumentIndexStatusModel from '../../core/models/document.index.status.model';
import type GeneratedDocumentIndexModel from '../../core/models/generated.document.index.model';
import CheckDocumentIndexStatusParams from '../../core/params/check.document.index.status.params';
import GenerateDocumentIndexParams from '../../core/params/generate.document.index.params';
import DocumentIndexPatchController from './document.index.patch.controller';

export interface DocumentIndexProgressJob {
  patchId: number;
  status: DocumentIndexPatchStatus;
  generatedIndex: GeneratedDocumentIndexModel | null;
}

export interface CheckDocumentIndexStatusOptions {
  openWhenComplete?: boolean;
  showProgressWhenPending?: boolean;
  reschedule?: boolean;
}

export default class DocumentIndexProgressController {
  private static instance: DocumentIndexProgressController;
  private readonly patchController: DocumentIndexPatchController;
  private readonly statusPollTimers = new Map<number, ReturnType<typeof window.setTimeout>>();
  private readonly cancelledPatchIds = new Set<number>();
  private startRequestId = 0;
  private lifecycleId = 0;

  public readonly indexingProgress = 10;
  public readonly startingDocumentId = ref<number>();
  public readonly checkingDocumentIds = ref<Set<number>>(new Set());
  public readonly jobs = ref<Record<number, DocumentIndexProgressJob>>({});
  public readonly activeDocumentId = ref<number>();
  public readonly generationDialogVisible = ref(false);
  public readonly cancelConfirmationVisible = ref(false);
  public readonly generatedDialogVisible = ref(false);
  public readonly generatedIndex = shallowRef<GeneratedDocumentIndexModel | null>(null);
  public readonly hasActiveIndexing = computed(() => {
    const documentId = this.activeDocumentId.value;
    return (
      documentId != null &&
      this.jobs.value[documentId]?.status === DocumentIndexPatchStatusEnum.IN_PROGRESS
    );
  });

  private constructor() {
    this.patchController = DocumentIndexPatchController.getInstance();
  }

  static getInstance(): DocumentIndexProgressController {
    if (!DocumentIndexProgressController.instance) {
      DocumentIndexProgressController.instance = new DocumentIndexProgressController();
    }
    return DocumentIndexProgressController.instance;
  }

  job(documentId: number): DocumentIndexProgressJob | undefined {
    return this.jobs.value[documentId];
  }

  isChecking(documentId: number): boolean {
    return this.checkingDocumentIds.value.has(documentId);
  }

  private setChecking(documentId: number, isChecking: boolean) {
    const nextIds = new Set(this.checkingDocumentIds.value);
    if (isChecking) nextIds.add(documentId);
    else nextIds.delete(documentId);
    this.checkingDocumentIds.value = nextIds;
  }

  private updateJob(documentId: number, job: DocumentIndexProgressJob) {
    this.jobs.value = { ...this.jobs.value, [documentId]: job };
  }

  private clearStatusPoll(documentId: number) {
    const timer = this.statusPollTimers.get(documentId);
    if (timer != null) window.clearTimeout(timer);
    this.statusPollTimers.delete(documentId);
  }

  private scheduleStatusPoll(documentId: number, patchId: number) {
    this.clearStatusPoll(documentId);
    this.statusPollTimers.set(
      documentId,
      window.setTimeout(() => {
        void this.checkStatus(documentId, patchId);
      }, 5000),
    );
  }

  async startIndex(documentId: number): Promise<boolean> {
    if (this.startingDocumentId.value != null) return false;

    const requestId = ++this.startRequestId;
    this.startingDocumentId.value = documentId;
    this.activeDocumentId.value = documentId;
    this.generatedIndex.value = null;
    this.cancelConfirmationVisible.value = false;
    this.generationDialogVisible.value = true;

    const result = await this.patchController.startIndex(
      new GenerateDocumentIndexParams(documentId, false),
    );
    if (requestId !== this.startRequestId) return false;
    this.startingDocumentId.value = undefined;

    if (!(result instanceof DataSuccess) || !result.data) {
      if (this.activeDocumentId.value === documentId) {
        this.generationDialogVisible.value = false;
        this.cancelConfirmationVisible.value = false;
        this.activeDocumentId.value = undefined;
      }
      return false;
    }

    this.cancelledPatchIds.delete(result.data);
    this.updateJob(documentId, {
      patchId: result.data,
      status: DocumentIndexPatchStatusEnum.IN_PROGRESS,
      generatedIndex: null,
    });
    this.activeDocumentId.value = documentId;
    this.scheduleStatusPoll(documentId, result.data);
    return true;
  }

  showGeneratedIndex(documentId: number, generatedIndex: GeneratedDocumentIndexModel) {
    this.activeDocumentId.value = documentId;
    this.generatedIndex.value = generatedIndex;
    this.generatedDialogVisible.value = true;
  }

  async checkStatus(
    documentId: number,
    patchId: number,
    options: CheckDocumentIndexStatusOptions = {},
  ): Promise<DocumentIndexStatusModel | null> {
    if (this.isChecking(documentId)) return null;

    const lifecycleId = this.lifecycleId;
    this.setChecking(documentId, true);
    const result = await this.patchController.checkStatus(
      new CheckDocumentIndexStatusParams(patchId),
    );
    if (lifecycleId !== this.lifecycleId) return null;
    this.setChecking(documentId, false);

    if (this.cancelledPatchIds.has(patchId)) return null;
    if (!(result instanceof DataSuccess) || !result.data) return null;

    const status = result.data;
    this.updateJob(documentId, {
      patchId,
      status: status.status,
      generatedIndex:
        status.status === DocumentIndexPatchStatusEnum.COMPLETE
          ? status.generatedIndex
          : (this.jobs.value[documentId]?.generatedIndex ?? null),
    });

    if (status.status === DocumentIndexPatchStatusEnum.COMPLETE) {
      this.clearStatusPoll(documentId);
      const shouldOpen =
        options.openWhenComplete ||
        (this.generationDialogVisible.value && this.activeDocumentId.value === documentId);
      if (this.activeDocumentId.value === documentId) {
        this.generationDialogVisible.value = false;
        this.cancelConfirmationVisible.value = false;
      }
      if (shouldOpen) this.showGeneratedIndex(documentId, status.generatedIndex);
      return status;
    }

    if (status.status === DocumentIndexPatchStatusEnum.FAILED) {
      this.clearStatusPoll(documentId);
      if (this.activeDocumentId.value === documentId) {
        this.generationDialogVisible.value = false;
        this.cancelConfirmationVisible.value = false;
      }
      return status;
    }

    if (options.showProgressWhenPending) {
      this.activeDocumentId.value = documentId;
      this.generationDialogVisible.value = true;
    }
    if (options.reschedule !== false) this.scheduleStatusPoll(documentId, patchId);
    return status;
  }

  async openDocumentIndex(documentId: number, fallbackPatchId: number) {
    const job = this.job(documentId);
    if (job?.status === DocumentIndexPatchStatusEnum.COMPLETE && job.generatedIndex) {
      this.showGeneratedIndex(documentId, job.generatedIndex);
      return;
    }

    await this.checkStatus(documentId, job?.patchId || fallbackPatchId, {
      openWhenComplete: true,
      showProgressWhenPending: true,
    });
  }

  async openProgress(documentId: number, fallbackPatchId: number) {
    const patchId = this.job(documentId)?.patchId || fallbackPatchId;
    this.activeDocumentId.value = documentId;
    this.cancelConfirmationVisible.value = false;
    this.generationDialogVisible.value = true;
    await this.checkStatus(documentId, patchId, { openWhenComplete: true });
  }

  async openActiveProgress() {
    const documentId = this.activeDocumentId.value;
    if (documentId == null) return;
    const job = this.job(documentId);
    if (!job) return;
    await this.openProgress(documentId, job.patchId);
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
    const documentId = this.activeDocumentId.value;
    if (documentId != null) {
      this.clearStatusPoll(documentId);
      const job = this.jobs.value[documentId];
      if (job) {
        this.cancelledPatchIds.add(job.patchId);
        const nextJobs = { ...this.jobs.value };
        delete nextJobs[documentId];
        this.jobs.value = nextJobs;
      }
    }
    this.generationDialogVisible.value = false;
    this.cancelConfirmationVisible.value = false;
    this.activeDocumentId.value = undefined;
  }

  reset() {
    this.startRequestId += 1;
    this.lifecycleId += 1;
    this.statusPollTimers.forEach((timer) => window.clearTimeout(timer));
    this.statusPollTimers.clear();
    this.cancelledPatchIds.clear();
    this.startingDocumentId.value = undefined;
    this.checkingDocumentIds.value = new Set();
    this.jobs.value = {};
    this.activeDocumentId.value = undefined;
    this.generationDialogVisible.value = false;
    this.cancelConfirmationVisible.value = false;
    this.generatedDialogVisible.value = false;
    this.generatedIndex.value = null;
  }
}
