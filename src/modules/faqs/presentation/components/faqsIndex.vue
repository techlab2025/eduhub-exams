<script setup lang="ts">

  import { onMounted, computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import FaqsController from '../controllers/faqs.controller';
  import EmptyFaqs from '@/shared/icons/faqs/EmptyFaqs.vue';
  import EditpinIcon from '@/shared/icons/EditpinIcon.vue';
  import DeleteFaqsParams from '../../core/params/delete.faqs.params';
  import type FaqsModel from '../../core/models/faqs.model';

  const controller = FaqsController.getInstance();
  const route = useRoute();
  const router = useRouter();

  const countryCode = computed(() => (route.params?.country_code as string) || '');

  const faqs = computed<FaqsModel[]>(() => {
    const data = controller.listState.value?.data;
    if (Array.isArray(data)) return (data as FaqsModel[]) ?? [];
    return [];
  });

  const hasData = computed(() => faqs.value.length > 0);

  const expandedIndex = ref<number | null>(0);

  const toggleExpand = (index: number) => {
    expandedIndex.value = expandedIndex.value === index ? null : index;
  };

  const getQuestion = (faq: FaqsModel) => faq.question?.['en'] || faq.question?.['ar'] || '';

  const getAnswer = (faq: FaqsModel) => faq.answer?.['en'] || faq.answer?.['ar'] || '';

  const editFaq = (id: number) => {
    router.push(`/${countryCode.value}/faqs/${id}/edit`);
  };

  const deleteFaq = async (id: number) => {
    await controller.delete(new DeleteFaqsParams({ id }), undefined);
    await controller.fetchList();
  };

  onMounted(async () => {
    await controller.fetchList();
  });

</script>

<template>
  <div class="faqs-page">
    <div class="faqs-header">
      <div class="faqs-header-text">
        <h2 class="faqs-title">{{ $t('faqs') }}</h2>
        <p class="faqs-description">{{ $t('faqs_description') }}</p>
      </div>
      <router-link v-if="hasData" :to="`/${countryCode}/faqs/add`" class="btn-add-faq">
        + {{ $t('add_faq') }}
      </router-link>
    </div>

    <div v-if="hasData" class="faqs-list">
      <div v-for="(faq, idx) in faqs" :key="faq.id ?? idx" class="faq-row">
        <div class="faq-row-header" @click="toggleExpand(idx)">
          <div class="faq-row-left">
            <button type="button" class="expand-btn" :class="{ expanded: expandedIndex === idx }">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="var(--PrimaryColor)" stroke-width="1.5" />
                <path
                  d="M12 8V16M8 12H16"
                  stroke="var(--PrimaryColor)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />

              </svg>
            </button>
            <span class="faq-question">{{ getQuestion(faq) }}</span>
          </div>
          <div class="faq-row-actions" @click.stop>
            <button type="button" class="action-btn edit-btn" @click="editFaq(faq.id!)">
              <EditpinIcon />
            </button>
            <button type="button" class="action-btn delete-btn" @click="deleteFaq(faq.id!)">

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6H5H21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6M19 6L18.12 19.13C18.05 20.15 17.23 20.94 16.21 20.94H7.79C6.77 20.94 5.95 20.15 5.88 19.13L5 6H19Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

              </svg>
            </button>
          </div>
        </div>


        <div v-if="expandedIndex === idx" class="faq-answer">
          <p>{{ getAnswer(faq) }}</p>
        </div>

        <div class="faq-row-divider" />
      </div>
    </div>

    <div v-else class="empty-state">
      <EmptyFaqs />
      <h3>{{ $t('no_faqs_yet') }}</h3>
      <p>{{ $t('no_faqs_description') }}</p>
      <router-link :to="`/${countryCode}/faqs/add`" class="btn-add-faq empty-cta">
        {{ $t('add_faq') }}
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">

  @use '../../../../styles/variables' as *;
  @use '../../../../styles/mixins/flex' as *;

  .faqs-page {
    @include flex-column(nowrap, flex-start, flex-start);

    gap: 20px;
    font-family: 'Medium';
    min-height: 80vh;

    .faqs-header {
      width: 100%;

      @include flex-row(nowrap, space-between, center);

      .faqs-header-text {
        @include flex-column(nowrap, flex-start, flex-start);

        gap: 4px;

        .faqs-title {
          color: $BgBlack;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .faqs-description {
          color: $Gray-5;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }
      }
    }

    .btn-add-faq {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      background-color: $PrimaryColor;
      color: $StandardWhite;
      border: none;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.2s;
      white-space: nowrap;

      &:hover {
        background-color: $PrimaryColorHover;
      }

      &.empty-cta {
        margin-top: 8px;
      }
    }

    .faqs-list {
      width: 100%;
      background-color: $StandardWhite;
      border: 1px solid $Gray-200-std;
      border-radius: 16px;
      overflow: hidden;

      .faq-row {
        .faq-row-header {
          @include flex-row(nowrap, space-between, center);

          padding: 16px 20px;
          cursor: pointer;
          transition: background-color 0.15s;

          &:hover {
            background-color: $GraySoft;
          }

          .faq-row-left {
            @include flex-row(nowrap, flex-start, center);

            gap: 12px;
            flex: 1;
            min-width: 0;

            .expand-btn {
              background: none;
              border: none;
              cursor: pointer;
              padding: 0;
              display: flex;
              align-items: center;
              flex-shrink: 0;
              transition: transform 0.2s;

              &.expanded {
                transform: rotate(45deg);
              }
            }

            .faq-question {
              color: $BgBlack;
              font-size: 15px;
              font-weight: 600;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .faq-row-actions {
            @include flex-row(nowrap, flex-end, center);

            gap: 8px;
            flex-shrink: 0;
            margin-left: 16px;

            .action-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              border: 1px solid $Gray-200-std;
              border-radius: 8px;
              background: $StandardWhite;
              cursor: pointer;
              color: $Gray-400-std;
              transition: all 0.2s;

              &.edit-btn:hover {
                border-color: $PrimaryColor;
                color: $PrimaryColor;
                // background-color: $PrimaryColorLight;
              }

              &.delete-btn:hover {
                border-color: $Red;
                color: $Red;
                background-color: $BgRed;
              }
            }
          }
        }

        .faq-answer {
          padding: 0 20px 16px 52px;

          p {
            color: $Gray-5;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.6;
            margin: 0;
          }
        }

        .faq-row-divider {
          border-top: 1px solid $Gray-100-std;
          margin: 0 20px;
        }

        &:last-child .faq-row-divider {
          display: none;
        }
      }
    }

    .empty-state {
      @include flex-column(nowrap, center, center);

      width: 100%;
      flex: 1;
      padding: 60px 20px;
      text-align: center;

      h3 {
        color: $BgBlack;
        font-size: 20px;
        font-weight: 700;
        margin: 16px 0 8px;
      }

      p {
        color: $Gray-5;
        font-size: 15px;
        font-weight: 500;
        margin: 0 0 16px;
      }
    }
  }
</style>
