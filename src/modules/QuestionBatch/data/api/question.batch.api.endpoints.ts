import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class QuestionBatchEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';

  readonly index = this.url('fetch_question_batches');
  readonly store = this.url('store_question_batch');
}
