<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import CountryController from '@/modules/country/presentation/controllers/country.controller';
  import CountryCard from './CountryCard.vue';
  import type CountryModel from '@/modules/country/core/models/country.model';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import IndexCountryParams from '@/modules/country/core/params/index.country.params';
  import { useRoute, useRouter } from 'vue-router';
  // import { debounce } from '@/base/Presentation/Utils/debouced';
  // import { debounce } from '@/base/Presentation/Utils/debouced';

  const controller = CountryController.getInstance();
  const state = computed(() => controller.listState.value);
  const perPage = ref<number>(10);
  const selectedCountryId = ref<number>(0);
  const selectedCountryCode = ref<string>('');
  const word = ref<string>('');
  const route = useRoute();
  const router = useRouter();

  const selectCountry = (country: CountryModel) => {
    // console.log(country.id, 'Country');
    selectedCountryId.value = country.id;
    selectedCountryCode.value = country.code;
  };

  const fetchCountries = async (page: number = 1, word: string = '') => {
    await controller.fetchList(
      new IndexCountryParams(
        word,
        route.query.page ? Number(route.query.page) : page,
        perPage.value,
      ),
    );
  };
  // const Search = debounce(() => {
  //   router.push({
  //     query: {
  //       ...route.query,
  //       page: Number(route.query.page ?? 1),
  //       word: word.value || undefined,
  //     },
  //   });

  //   fetchCountries(1, word.value);
  // });

  // const isDraft = computed(() => {
  //   const data = FormStore?.formData[formRoute] ?? {};
  //   return Object.keys(data).length === 0 || Object.values(data).every((v) => v == null);
  // });

  // Fetch emails on component mount
  onMounted(async () => {
    if (route.query.word) {
      word.value = String(route.query.word);
    }

    await fetchCountries(route.query.page ? Number(route.query.page) : 1, word.value);
  });

  const continueToLogin = () => {
    if (!selectedCountryId.value) return;
    router.push({
      name: 'Login',
      params: {
        country_code: selectedCountryCode.value,
      },
    });
  };
</script>

<template>
  <section class="auth-layout">
    <div class="auth-header">
      <h3 class="title">{{ $t('Choose your country') }}</h3>
      <p class="sub-title">
        {{ $t('Choose your country to access localized content and settings') }}
      </p>
    </div>
    <!-- <div class="search-field">
      <span class="search-icon">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        v-model="word"
        :placeholder="$t('search_by_country')"
        class="search-input"
        type="text"
        @input="Search"
      />
    </div> -->
    <DataStatusBuilder :controller="state" :on-retry="async () => await fetchCountries()">
      <template #success="{ data }">
        <div class="country-grid">
          <!-- <div class="country-item"> -->
          <CountryCard
            v-for="country in data"
            :key="country.id"
            :country="country"
            :selected-country-id="selectedCountryId"
            @select-country="selectCountry"
          />
          <!-- </div> -->
        </div>
      </template>
    </DataStatusBuilder>
    <button
      :class="['btn btn-primary', { disabled: !selectedCountryId }]"
      type="button"
      :disabled="!selectedCountryId"
      @click="continueToLogin"
    >
      {{ $t('continue_to_login') }}
    </button>
  </section>
</template>
