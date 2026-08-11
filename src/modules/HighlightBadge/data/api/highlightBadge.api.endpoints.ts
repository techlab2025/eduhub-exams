import { BaseEndpoints } from '@/base/Data/Endpoints/BaseEndpoints';

export class HighlightBadgeEndpoints extends BaseEndpoints {
  protected readonly prefix = 'dashboard/';
  readonly index = this.url('fetch_highlight_badges');
  readonly store = this.url('store_highlight_badge');
  readonly show = this.url('show_highlight_badge');
  readonly update = this.url('update_highlight_badge');
  readonly delete = this.url('delete_highlight_badge');
}
