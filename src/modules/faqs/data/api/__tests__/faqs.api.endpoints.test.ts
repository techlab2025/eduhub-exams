import { describe, it, expect } from 'vitest';
import { FaqsEndpoints } from '../faqs.api.endpoints';

describe('FaqsEndpoints', () => {
  const endpoints = new FaqsEndpoints();

  it('index URL contains fetch_faq', () => {
    expect(endpoints.index).toContain('fetch_faq');
  });

  it('show URL contains show_faq', () => {
    expect(endpoints.show).toContain('show_faq');
  });

  it('store URL contains store_faq', () => {
    expect(endpoints.store).toContain('store_faq');
  });

  it('update URL contains update_faq', () => {
    expect(endpoints.update).toContain('update_faq');
  });

  it('delete URL contains delete_faq', () => {
    expect(endpoints.delete).toContain('delete_faq');
  });

  it('all URLs share the dashboard/ prefix', () => {
    expect(endpoints.index).toContain('dashboard/');
    expect(endpoints.store).toContain('dashboard/');
    expect(endpoints.delete).toContain('dashboard/');
  });
});
