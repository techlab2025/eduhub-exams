<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import type AboutModel from '../../core/models/about.model';
  import EditAboutParams from '../../core/params/edit.about.params';
  import MultiLangInput from '@/shared/MultiLangInput.vue';
  import TranslationParams from '../../core/params/translation.params';
  import HandleFilesUpload from '@/shared/FormInputs/HandleFilesUpload.vue';
  import UplaodImageInput from '@/shared/icons/UploadImage/UplaodImageInput.vue';
  import LinksIcon from '@/shared/icons/SocialIcons/LinksIcon.vue';
  import type SocialModel from '../../core/models/social.model';
  import Generalinformaion from '@/shared/icons/generalinformaion.vue';
  import AddAboutParams from '../../core/params/add.about.params';
  import DeleteSocialLinkParams from '../../core/params/delete.social.link.params';
  import AboutController from '../controllers/about.controller';
  import ShowAboutParams from '../../core/params/show.about.params';
  import SocialParams from '../../core/params/Socail.params';

  // ─── Types ───────────────────────────────────────────────────────────────────

  // ─── Emits & Props ────────────────────────────────────────────────────────────

  const emit = defineEmits(['updateData']);

  const { about, loading } = defineProps<{
    about?: AboutModel;
    formKey?: string;
    loading?: boolean;
  }>();

  // ─── Form State ───────────────────────────────────────────────────────────────

  const description = ref<Record<string, string>>({});
  const title = ref<Record<string, string>>({});
  const image = ref<string | null>(null);

  type SocialMediaEntry = {
    id?: number;
    link: string;
    icon: string;
    iconChanged?: boolean;
  };

  const socialMediaList = ref<SocialMediaEntry[]>([{ link: '', icon: '' }]);

  // ─── Watchers ─────────────────────────────────────────────────────────────────

  // ─── Route ────────────────────────────────────────────────────────────────────

  const route = useRoute();

  // ─── Social Media Handlers ────────────────────────────────────────────────────

  const addSocialMediaEntry = () => {
    socialMediaList.value.push({ link: '', icon: '', iconChanged: false });
  };

  const controller = AboutController.getInstance();

  const syncSocialMediaFromAbout = (aboutData: AboutModel) => {
    socialMediaList.value = aboutData.socialMedia?.length
      ? aboutData.socialMedia.map((item: SocialModel) => ({
          id: item.id,
          link: item.link ?? '',
          icon: item.icon ?? '',
          iconChanged: false,
        }))
      : [{ link: '', icon: '', iconChanged: false }];
  };

  const syncFormFromAbout = (aboutData: AboutModel) => {
    description.value = aboutData.translations.description || {};
    title.value = aboutData.translations.title || {};
    image.value = aboutData.images || null;
    syncSocialMediaFromAbout(aboutData);
  };

  const removeLocalSocialMediaEntry = (index: number) => {
    if (socialMediaList.value.length === 1) {
      socialMediaList.value = [{ link: '', icon: '', iconChanged: false }];
      updateData();
      return;
    }

    socialMediaList.value.splice(index, 1);
    updateData();
  };

  const deleteSocialLink = async (index: number, id?: number) => {
    if (!id) {
      removeLocalSocialMediaEntry(index);
      return;
    }

    await controller.deleteSocialLink(new DeleteSocialLinkParams(id));

    const aboutId = Number(about?.id || route.params.id || 1);
    await controller.fetchOne(new ShowAboutParams(aboutId));

    if (controller.itemData.value) {
      syncFormFromAbout(controller.itemData.value);
      updateData();
    }
  };

  // const _removeSocialMediaEntry = (index: number) => {
  //   if (socialMediaList.value.length === 1) {
  //     socialMediaList.value = [{ link: '', icon: '' }];
  //     return;
  //   }
  //   socialMediaList.value.splice(index, 1);
  // };

  const resetSocialMedia = () => {
    socialMediaList.value = [{ link: '', icon: '', iconChanged: false }];
    updateData();
  };
  const uploadKey = ref(0);
  const resetGeneralInputs = () => {
    title.value = {};
    description.value = {};
    image.value = null;
    uploadKey.value++;
  };

  // ─── Form Actions ─────────────────────────────────────────────────────────────

  const updateData = () => {
    const socialMedia = socialMediaList.value
      .filter((entry) => (entry.link?.trim() || '') !== '' || (entry.icon?.trim() || '') !== '')
      .map((entry) => {
        const params = new SocialParams({
          social_link_id: entry.id,
          link: entry.link || '',
          icon: entry.icon || '',
        });

        if (entry.id && !entry.iconChanged) {
          delete (params as Partial<SocialParams>).icon;
        }

        return params;
      });

    let params: EditAboutParams | AddAboutParams;
    if (route.params.id) {
      params = new EditAboutParams({
        translations: new TranslationParams({
          title: title.value,
          description: description.value,
        }),
        images: image.value || '',
        socialMedia: socialMedia,
      });
    } else {
      params = new AddAboutParams({
        images: image.value || '',
        translation: new TranslationParams({
          title: title.value,
          description: description.value,
        }),
        socialMedia: socialMedia,
      });
    }

    // console.log(params, "params")
    emit('updateData', params);
  };

  // ─── File Handler ─────────────────────────────────────────────────────────────

  const handleImageChange = (file: Array<{ base64: string }>) => {
    image.value = file[0]?.base64 ?? null;
    updateData();
  };

  const handleSocialImageChange = (index: number, file: Array<{ base64: string }>) => {
    const entry = socialMediaList.value[index];
    if (!entry) return;

    entry.icon = file[0]?.base64 ?? '';
    entry.iconChanged = true;
    updateData();
  };

  watch(
    () => about,
    (newAbout) => {
      if (newAbout) {
        syncFormFromAbout(newAbout);
        // Initialize parent params with loaded data
        updateData();
      }
    },
    { immediate: true },
  );
</script>

<template>
  <div class="about-form-card">
    <div class="about-header">
      <h2 class="title">{{ $t('about us') }}</h2>
      <p class="description">
        {{ $t('Manage and review platform information visible to students') }}
      </p>
    </div>
    <div class="general-information-header">
      <div class="general-information-title">
        <span class="globe-icon">
          <Generalinformaion />
        </span>
        <span>{{ $t('General_Information') }}</span>
      </div>
      <button type="button" class="reset-btn" @click="resetGeneralInputs">{{ $t('reset') }}</button>
    </div>
    <div class="form-fields">
      <!-- Title -->
      <div class="field-group col-span-2" :class="{ disabled: loading }">
        <MultiLangInput
          :field-key="`title`"
          :label="$t(`title`)"
          :languages="['en', 'ar']"
          :model-value="title"
          :type="`title`"
          @update:model-value="
            title = $event;
            updateData();
          "
        />
      </div>

      <!-- Description -->
      <div class="field-group col-span-2" :class="{ disabled: loading }">
        <MultiLangInput
          :field-key="`description`"
          :label="$t(`Description`)"
          :languages="['en', 'ar']"
          :model-value="description"
          :type="`description`"
          @update:model-value="
            description = $event;
            updateData();
          "
        />
      </div>

      <!-- Image Upload -->
      <div class="field-group col-span-2" :class="{ disabled: loading }">
        <HandleFilesUpload
          :key="uploadKey"
          :label="`upload image`"
          accept="image/*"
          :multiple="false"
            :max-files="1"
          :index="1"
          :file="image || undefined"
          :have-content="true"
          :class="`image-input`"
          @change="handleImageChange"
        >
          <template #content>
            <div class="add-imaegs-data">
              <UplaodImageInput />
              <p class="first-text"><span>Click to upload</span> or drag and drop</p>
              <p class="second-text">JPG, JPEG, PNG less than 1MB</p>
            </div>
          </template>
        </HandleFilesUpload>
      </div>

      <!-- ── Social Media Links ─────────────────────────────────────────── -->
      <div class="field-group col-span-2 social-media-section">
        <div class="social-media-header">
          <div class="social-media-title">
            <span class="globe-icon">
              <LinksIcon />
            </span>
            <span>Social Media Links</span>
          </div>
          <button type="button" class="reset-btn" @click="resetSocialMedia">Reset</button>
        </div>

        <!-- Column Labels -->
        <div class="social-media-labels">
          <span>Social Media Link</span>
          <span>Social Media Icon</span>
        </div>

        <!-- {{ socialMedia }} -->
        <div v-for="(entry, index) in socialMediaList" :key="index" class="social-media-row">
          <input
            v-model="entry.link"
            type="url"
            placeholder="Social Media Link"
            class="sm-input"
            @input="updateData"
          />

          <div class="field-group" :class="{ disabled: loading }">
            <HandleFilesUpload
              :key="index"
              label="upload image"
              accept="image/*"
              :multiple="false"
              :index="index + 2"
              :file="entry.icon || undefined"
              :have-content="true"
              class="image-input image-link-input"
              @change="handleSocialImageChange(index, $event)"
            >
              <template #content>
                <div class="add-imaegs-data">
                  <p class="first-text"><span>Click to upload</span> or drag and drop</p>
                </div>
              </template>
            </HandleFilesUpload>
          </div>

          <div class="btns">
            <button
              v-if="index === socialMediaList.length - 1"
              type="button"
              class="sm-add-btn"
              title="Add another link"
              @click="addSocialMediaEntry"
            >
              <span>+</span>
            </button>
            <button
              type="button"
              class="sm-remove-btn"
              title="Remove this link"
              @click="deleteSocialLink(index, entry.id)"
            >
              <!--   v-if="index != 0" -->
              <span>×</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .image-link-input {
    position: relative;
    width: 100%;
    height: 44px;
    min-height: 44px;
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    background: var(--BgWhite);
    overflow: hidden;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;

    &:hover {
      border-color: var(--PrimaryColor);
      box-shadow: 0 0 0 3px var(--PrimaryColor-light);
    }

    .add-imaegs-data {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .first-text {
        margin: 0;
        font-size: 12px;
        color: var(--gray-500);
        white-space: nowrap;

        span {
          color: var(--PrimaryColor);
          font-weight: 600;
        }
      }
    }

    :deep(.preview-grid) {
      position: absolute;
      inset: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      max-height: 100%;
      padding: 4px;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: var(--BgWhite);
      border-radius: inherit;
    }

    :deep(.preview-item) {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 9px;
      overflow: hidden;
      background: var(--gray-100);
      transform: none !important;
    }

    :deep(.preview-item:hover) {
      transform: none !important;
    }

    :deep(.preview-thumb),
    :deep(.preview-item img) {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      padding: 3px;
      background: var(--BgWhite);
    }

    :deep(.preview-overlay),
    :deep(.download-badge) {
      display: none;
    }

    :deep(.remove-btn) {
      opacity: 1;
      top: 50%;
      right: 6px;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      font-size: 9px;
      background: var(--black-alpha-45);
    }
  }

  .image-input {
    :deep(.upload-area) {
      padding: 10px !important;
      border-radius: 20px;
    }

    :deep(.upload-label) {
      display: none;
    }
  }

  .social-media-row {
    display: grid;
    grid-template-columns: 1fr 1fr 40px !important;
    gap: 12px;
    align-items: center;

    &:last-child {
      .btns {
        margin-left: 6px;

        button {
          width: 20px !important;
          height: 20px !important;
        }
      }
    }
  }

  .btns {
    display: flex;
    gap: 8px;
    flex-direction: row-reverse;
  }

  .field-group {
    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.7;
    }
  }
</style>
