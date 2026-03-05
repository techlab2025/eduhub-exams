<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { ref, watch } from 'vue'
import IconSetting from '@/shared/icons/IconSetting.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

interface Routes {
  link: string
  name: string
}

const SettingsRoutes = ref<Routes[]>([
  {
    link: '/admin/admins',
    name: 'admins',

  },

])

const LocationRoutes = ref<Routes[]>([
  {
    link: '/admin/countries',
    name: 'country',

  },

])


const SelectedSettingsRoute = ref<string>('')
const SelectedLocationRoute = ref<string>('')

watch(
  () => route.path,
  (newPath) => {
    SelectedSettingsRoute.value = SettingsRoutes.value.find(item => item.link === newPath)?.name || ''
    SelectedLocationRoute.value = LocationRoutes.value.find(item => item.link === newPath)?.name || ''
  }
)

const settingsAccordion = ref<string | null>('0')
const locationAccordion = ref<string | null>('1')
</script>

<template>

  <Accordion v-model:value="settingsAccordion">
    <AccordionPanel value="0">
      <AccordionHeader>
        <div class="links-header">
          <IconSetting />
          {{ $t('settings') }}
        </div>
      </AccordionHeader>

      <AccordionContent>
        <ul>
          <li v-for="(route, index) in SettingsRoutes" :key="index">
            <router-link :to="route.link" :class="route?.fullPath?.includes(route.link) ? '' : ''">
              <span>{{ $t(route.name) }}</span>
            </router-link>
          </li>
        </ul>
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel class="active-panel-out" v-if="SelectedSettingsRoute && !settingsAccordion">
      <span>{{ SelectedSettingsRoute }}</span>
    </AccordionPanel>
  </Accordion>

  <Accordion v-model:value="locationAccordion">
    <AccordionPanel value="1">
      <AccordionHeader>
        <div class="links-header">
          <IconSetting />
          {{ $t('location') }}
        </div>
      </AccordionHeader>
      <AccordionContent>
        <ul>
          <li v-for="(route, index) in LocationRoutes" :key="index">
            <router-link :to="route.link">
              <span>{{ $t(route.name) }}</span>
            </router-link>
          </li>
        </ul>
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel class="active-panel-out" v-if="SelectedLocationRoute && !locationAccordion">
      <span>{{ SelectedLocationRoute }}</span>
    </AccordionPanel>
  </Accordion>

</template>
