<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import AboutController from '../controllers/about.controller';
import ShowAboutParams from '../../core/params/show.about.params';
import EditpinIcon from '@/shared/icons/EditpinIcon.vue';
import LinksIcon from '@/shared/icons/SocialIcons/LinksIcon.vue';
import EmptyData from '@/shared/icons/About/EmptyData.vue';

// Controller instance
const controller = AboutController.getInstance();
const state = computed(() => controller.itemState.value)
const route = useRoute();

const fetchAbout = async () => {
  await controller.fetchOne(new ShowAboutParams());
};

onMounted(async () => {
  await fetchAbout();
});

const countryCode = computed(() => (route.params?.country_code as string) || '');


</script>

<template>
  <div class="about-page">
    <div class="header-container">
      <div class="about-header">
        <h2 class="title">about us </h2>
        <p class="description">Manage and review platform information visible to students</p>
      </div>
      <router-link :to="`/${countryCode}/about/edit`" class="btn btn-primary">
        <EditpinIcon />
        <span>Edit</span>
      </router-link>
    </div>
    <div class="about-content" v-if="state.data != null">
      <div class="text-content">
        <h5>{{ state.data?.translations.title['ar'] }}</h5>
        <p>{{ state.data?.translations.title['ar'] }}</p>
      </div>
      <div class="image-content">
        <img :src="state.data?.images" alt="about-img">
      </div>
      <div class="social-content">
        <div class="socail-header">
          <LinksIcon />
          <h5>social media links</h5>
        </div>
        <div class="social-icons">
          <router-link :to="item.link!" v-for="(item, index) in state.data?.socailMedia" :key="index">
            <img :src="item.icon" alt="icon">
          </router-link>
        </div>
      </div>
    </div>
    <div class="empty-data" v-else>
      <EmptyData />
      <h5>No about information added</h5>
      <p>Add details about your platform to display them to students</p>
      <router-link :to="`/${countryCode}/about/add`" class="btn btn-primary">Add about</router-link>
    </div>
  </div>

</template>
