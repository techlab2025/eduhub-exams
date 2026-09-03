import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import { describe, expect, it } from 'vitest';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';
import NotificationPlanDetailsSkeleton from '../NotificationPlanDetailsSkeleton.vue';

const SkeletonStub = defineComponent({
  template: '<span class="p-skeleton" />',
});

const mountSkeleton = (locale: 'ar' | 'en' = 'en') =>
  mount(NotificationPlanDetailsSkeleton, {
    global: {
      plugins: [
        createI18n({
          legacy: false,
          locale,
          fallbackLocale: 'en',
          messages: { ar, en },
        }),
      ],
      stubs: { Skeleton: SkeletonStub },
    },
  });

describe('NotificationPlanDetailsSkeleton', () => {
  it('mirrors the main notification plan details sections', () => {
    const wrapper = mountSkeleton();

    expect(wrapper.attributes('aria-busy')).toBe('true');
    expect(wrapper.attributes('aria-label')).toBe('Loading notification plan details');
    expect(wrapper.find('.notification-plan-details__recipients').exists()).toBe(true);
    expect(wrapper.find('.notification-plan-details__feature').exists()).toBe(true);
    expect(wrapper.findAll('.notification-plan-details-skeleton__record-row')).toHaveLength(4);
    expect(wrapper.findAll('.p-skeleton').length).toBeGreaterThan(10);
  });

  it('provides an Arabic loading label', () => {
    expect(mountSkeleton('ar').attributes('aria-label')).toBe('جارٍ تحميل تفاصيل خطة الإشعارات');
  });
});
