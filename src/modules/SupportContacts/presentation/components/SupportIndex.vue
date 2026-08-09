<script setup lang="ts">
  import { onMounted, computed, type Component } from 'vue';
  import SupportContactsController from '../controllers/support.controller';
  import SupportEmptyDataIcon from '@/shared/icons/Support/SupportEmptyDataIcon.vue';
  import EditpinIcon from '@/shared/icons/EditpinIcon.vue';
  import { DataSuccess } from '@/base/Core/NetworkStructure/Resources/dataState/dataState';
  import PhoneIcon from '@/shared/icons/Support/PhoneIcon.vue';
  import WhatsIcon from '@/shared/icons/Support/WhatsIcon.vue';
  import EmailIcon from '@/shared/icons/Support/EmailIcon.vue';
  import TelegramIcon from '@/shared/icons/Support/TelegramIcon.vue';
  import IndexSupportContactsParams from '../../core/params/index.about.params';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import SupportSeklaton from '../SupportSeklaton.vue';
  import IndexDelete from '@/shared/icons/DocaumentType/IndexDelete.vue';
  import DeleteSupportContactParams from '../../core/params/delete.support.contacts.params';
  import DeleteDialog from '@/base/Presentation/Dialogs/MainDialogs/DeleteDialog.vue';
  import type SupportContactsModel from '../../core/models/support.contatcts.model';
  import type ContactsModel from '../../core/models/contatcts.model';

  const controller = SupportContactsController.getInstance();

  const contacts = computed(() => {
    const state = controller.listState.value;
    if (state instanceof DataSuccess) return (state.data as SupportContactsModel[]) ?? [];
    return [];
  });

  const contactGroups: { key: string; labelKey: string; icon: Component }[] = [
    { key: 'phonenumbers', labelKey: 'Phone Number', icon: PhoneIcon },
    { key: 'whatsapp_numbers', labelKey: 'chat_on_whatsapp', icon: WhatsIcon },
    { key: 'emails', labelKey: 'email_address', icon: EmailIcon },
    { key: 'telegram_numbers', labelKey: 'telegram', icon: TelegramIcon },
  ];

  const getContactValues = (section: SupportContactsModel, key: string): ContactsModel[] => {
    return section.supportContacts.filter((contact) => contact.key === key && contact.value);
  };

  const hasData = computed(() => contacts.value.length > 0);

  const fetchContacts = async () => {
    const indexSupportParams = new IndexSupportContactsParams('', 1, 10, false);
    await controller.fetchList(indexSupportParams);
  };

  const deleteSupport = async (id: number) => {
    await controller.delete(new DeleteSupportContactParams(id));
    await fetchContacts();
  };

  onMounted(fetchContacts);
</script>

<template>
  <DataStatusBuilder :controller="controller.listState.value">
    <template #success>
      <div class="support-contact-page">
        <div class="header-container">
          <div class="about-header">
            <h2 class="title">{{ $t('support_contact_details') }}</h2>
            <p class="description">{{ $t('support_contact_details_description') }}</p>
          </div>
          <div class="header-actions">
            <router-link to="/support/add" class="btn-outline-green">
              + {{ $t('add_new_support_section') }}
            </router-link>
          </div>
        </div>

        <div v-if="hasData" class="sections-list">
          <section v-for="section in contacts" :key="section.id" class="support-view-card">
            <div class="section-title-bar">
              <span>{{ section.titles }}</span>
              <div class="row-actions">
                <router-link :to="`/support/edit/${section?.id}`" class="action-btn edit">
                  <EditpinIcon />
                </router-link>
                <DeleteDialog
                  :title="$t('delete_support_contact_title')"
                  :message="$t('delete_support_contact_message')"
                  :hasbtn="true"
                  @delete="deleteSupport(section.id!)"
                >
                  <template #btn>
                    <span class="action-btn delete">
                      <IndexDelete />
                    </span>
                  </template>
                </DeleteDialog>
              </div>
            </div>

            <div v-if="section.supportContacts.length" class="contact-groups">
              <div
                v-for="group in contactGroups"
                v-show="getContactValues(section, group.key).length"
                :key="group.key"
                class="contact-group"
                :data-contact-group="group.key"
              >
                <div class="contact-group-label">
                  <span class="contact-label-icon" aria-hidden="true">
                    <component :is="group.icon" />
                  </span>
                  <span>{{ $t(group.labelKey) }}</span>
                </div>

                <div class="contact-values">
                  <span
                    v-for="contact in getContactValues(section, group.key)"
                    :key="contact.id ?? contact.value"
                    class="contact-value-chip"
                  >
                    {{ contact.value }}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="about-page">
        <div class="empty-data">
          <SupportEmptyDataIcon />
          <h5>{{ $t('no_contact_details') }}</h5>
          <p>{{ $t('no_contact_details_description') }}</p>
          <router-link to="/support/add" class="btn btn-primary">
            {{ $t('add_support') }}
          </router-link>
        </div>
      </div>
    </template>
    <template #loader>
      <SupportSeklaton />
    </template>
    <template #default>
      <div class="about-page">
        <div class="empty-data">
          <SupportEmptyDataIcon />
          <h5>{{ $t('no_contact_details') }}</h5>
          <p>{{ $t('no_contact_details_description') }}</p>
          <router-link to="/support/add" class="btn btn-primary">
            {{ $t('add_support') }}
          </router-link>
        </div>
      </div>
    </template>
  </DataStatusBuilder>
</template>

<style scoped lang="scss">
  .support-contact-page {
    padding-bottom: 24px;
    background: var(--gray-50);
  }

  .sections-list {
    gap: 20px;
    background: transparent;
    border-radius: 0;
  }

  .support-view-card {
    border: 1px solid var(--gray-100);
    border-radius: 14px;
    background: var(--standard-white);
    box-shadow: var(--shadow-sm);
  }

  .section-title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 52px;
    padding: 12px 16px;
    border-bottom: 1px dashed var(--gray-200);

    > span {
      color: var(--PrimaryColor);
      font-size: 16px;
      font-weight: 700;
    }
  }

  .row-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .contact-groups {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 14px 16px 16px;
  }

  .contact-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .contact-group-label {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--color-dark-gray);
    font-size: 14px;
    font-weight: 500;
  }

  .contact-label-icon {
    display: inline-flex;
    width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 5px;

    :deep(svg) {
      width: 20px;
      height: 20px;
    }
  }

  .contact-values {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .contact-value-chip {
    min-width: 135px;
    max-width: 100%;
    padding: 7px 16px;
    overflow-wrap: anywhere;
    border-radius: var(--radius-full);
    background: var(--PrimaryColor-alpha-10);
    color: var(--standard-black);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.15;
    text-align: center;
    text-transform: none;
  }

  @media (max-width: 600px) {
    .header-container {
      align-items: flex-start;
      flex-direction: column;
      gap: 14px;
    }

    .contact-value-chip {
      min-width: min(135px, 100%);
    }
  }
</style>
