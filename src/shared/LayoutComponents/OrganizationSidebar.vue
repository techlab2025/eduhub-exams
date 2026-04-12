<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import { ref, watch } from 'vue'
import PermissionBuilder from '@/components/DataStatus/PermissionBuilder.vue'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useRoute } from 'vue-router'
import GeerIcon from '../icons/GeerIcon.vue'

const route = useRoute()
interface Routes {
  link: string
  name: string
  permissions: PermissionsEnum[]
}
const OrganizationRoutes = ref<Routes[]>([
  {
    link: '/organization/accidents-type',
    name: 'Accidents Types',
    permissions: [
      PermissionsEnum.WEBSITE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_ALL,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_CREATE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_UPDATE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_DETAILS,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_DELETE,
      PermissionsEnum.ORG_ACCIDENTS_TYPE_FETCH,
    ],
  },
  {
    link: '/organization/partner',
    name: 'partners',
    permissions: [
      PermissionsEnum.WEBSITE,
      PermissionsEnum.PARTNER_ALL,
      PermissionsEnum.PARTNER_CREATE,
      PermissionsEnum.PARTNER_UPDATE,
      PermissionsEnum.PARTNER_DETAILS,
      PermissionsEnum.PARTNER_DELETE,
      PermissionsEnum.PARTNER_FETCH,
    ],
  },
  {
    link: '/organization/projects',
    name: 'Projects',
    permissions: [
      PermissionsEnum.PROJECT_ALL,
      PermissionsEnum.PROJECT_CREATE,
      PermissionsEnum.PROJECT_DELETE,
      PermissionsEnum.PROJECT_FETCH,
      PermissionsEnum.PROJECT_UPDATE,
    ],
  },
  {
    link: '/organization/certificate',
    name: 'certificates',
    permissions: [
      PermissionsEnum.CERTIFICATE_ALL,
      PermissionsEnum.CERTIFICATE_CREATE,
      PermissionsEnum.CERTIFICATE_DELETE,
      PermissionsEnum.CERTIFICATE_FETCH,
      PermissionsEnum.CERTIFICATE_UPDATE,
    ],
  },
  {
    link: '/organization/equipment-types',
    name: 'Equipment Types',
    permissions: [
      PermissionsEnum.ORG_EQUIPMENT_TYPE_ALL,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_DETAILS,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_TYPE_UPDATE,
    ],
  },
  {
    link: '/organization/equipments',
    name: 'Equipments',
    permissions: [
      PermissionsEnum.ORG_EQUIPMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_UPDATE,
    ],
  },
  {
    link: '/organization/factory',
    name: 'factors',
    permissions: [
      PermissionsEnum.ORG_FACTORY_ALL,
      PermissionsEnum.ORG_FACTORY_CREATE,
      PermissionsEnum.ORG_FACTORY_DELETE,
      PermissionsEnum.ORG_FACTORY_FETCH,
      PermissionsEnum.ORG_FACTORY_UPDATE,
    ],
  },
  {
    link: '/organization/factories-items',
    name: 'factor_item',
    permissions: [
      PermissionsEnum.ORG_FACTORY_ITEM_ALL,
      PermissionsEnum.ORG_FACTORY_ITEM_CREATE,
      PermissionsEnum.ORG_FACTORY_ITEM_DELETE,
      PermissionsEnum.ORG_FACTORY_ITEM_FETCH,
      PermissionsEnum.ORG_FACTORY_ITEM_UPDATE,
    ],
  },
  {
    link: '/organization/hazard-type',
    name: 'Hazard Types',
    permissions: [
      PermissionsEnum.ORG_HAZARD_TYPE_ALL,
      PermissionsEnum.ORG_HAZARD_TYPE_CREATE,
      PermissionsEnum.ORG_HAZARD_TYPE_DELETE,
      PermissionsEnum.ORG_HAZARD_TYPE_FETCH,
      PermissionsEnum.ORG_HAZARD_TYPE_UPDATE,
    ],
  },
  {
    link: '/organization/observation-type',
    name: 'observation_types',
    permissions: [
      PermissionsEnum.ORG_OBSERVATION_TYPE_ALL,
      PermissionsEnum.ORG_OBSERVATION_TYPE_CREATE,
      PermissionsEnum.ORG_OBSERVATION_TYPE_DELETE,
      PermissionsEnum.ORG_OBSERVATION_TYPE_FETCH,
      PermissionsEnum.ORG_OBSERVATION_TYPE_UPDATE,
      PermissionsEnum.ORGANIZATION_EMPLOYEE,
    ],
  },
  // {
  //   link: '/organization/health-conditions',
  //   name: 'health_conditions',
  //   permissions: [
  //     PermissionsEnum.ORG_HEALTH_CONDITION_ALL,
  //     PermissionsEnum.ORG_HEALTH_CONDITION_CREATE,
  //     PermissionsEnum.ORG_HEALTH_CONDITION_DELETE,
  //     PermissionsEnum.ORG_HEALTH_CONDITION_FETCH,
  //     PermissionsEnum.ORG_HEALTH_CONDITION_UPDATE,
  //   ],
  // },
  {
    link: '/organization/template',
    name: 'Templates',
    permissions: [
      PermissionsEnum.ORG_TEMPLATE_ALL,
      PermissionsEnum.ORG_TEMPLATE_CREATE,
      PermissionsEnum.ORG_TEMPLATE_DELETE,
      PermissionsEnum.ORG_TEMPLATE_FETCH,
      PermissionsEnum.ORG_TEMPLATE_UPDATE,
    ],
  },
  {
    link: '/organization/organization-employee',
    name: 'employees',
    permissions: [
      PermissionsEnum.ORG_EMPLOYEE_ALL,
      PermissionsEnum.ORG_EMPLOYEE_CREATE,
      PermissionsEnum.ORG_EMPLOYEE_DELETE,
      PermissionsEnum.ORG_EMPLOYEE_FETCH,
      PermissionsEnum.ORG_EMPLOYEE_UPDATE,
      PermissionsEnum.ORG_EMPLOYEE_DETAILS,
    ],
  },
  {
    link: '/organization/herikaly',
    name: 'hierarchy',
    permissions: [
      PermissionsEnum.HERIKALY_ALL,
      PermissionsEnum.HERIKALY_CREATE,
      PermissionsEnum.HERIKALY_DELETE,
      PermissionsEnum.HERIKALY_FETCH,
      PermissionsEnum.HERIKALY_UPDATE,
    ],
  },
  // {
  //   link: '/organization/methods',
  //   name: 'methods',
  //   permissions: [
  //     PermissionsEnum.ORG_METHOD_ALL,
  //     PermissionsEnum.ORG_METHOD_CREATE,
  //     PermissionsEnum.ORG_METHOD_DELETE,
  //     PermissionsEnum.ORG_METHOD_FETCH,
  //     PermissionsEnum.ORG_METHOD_UPDATE,
  //   ],
  // },
  {
    link: '/organization/team',
    name: 'team',
    permissions: [
      PermissionsEnum.ORG_TEAM_ALL,
      PermissionsEnum.ORG_TEAM_CREATE,
      PermissionsEnum.ORG_TEAM_DELETE,
      PermissionsEnum.ORG_TEAM_FETCH,
      PermissionsEnum.ORG_TEAM_UPDATE,
    ],
  },
  {
    link: '/organization/contractor',
    name: 'contractors',
    permissions: [
      PermissionsEnum.ORG_CONTRACTOR_ALL,
      PermissionsEnum.ORG_CONTRACTOR_CREATE,
      PermissionsEnum.ORG_CONTRACTOR_DELETE,
      PermissionsEnum.ORG_CONTRACTOR_FETCH,
      PermissionsEnum.ORG_CONTRACTOR_UPDATE,
    ],
  },
  {
    link: '/organization/equipment-mangement/all-observatin',
    name: 'management',
    permissions: [
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_ALL,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_CREATE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_DELETE,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_FETCH,
      PermissionsEnum.ORG_EQUIPMENT_MANGEMENT_UPDATE,
    ],
  },
  {
    link: '/organization/role',
    name: 'roles',
    permissions: [
      PermissionsEnum.ORG_ROLE_ALL,
      PermissionsEnum.ORG_ROLE_CREATE,
      PermissionsEnum.ORG_ROLE_DELETE,
      PermissionsEnum.ORG_ROLE_FETCH,
      PermissionsEnum.ORG_ROLE_UPDATE,
    ],
  },
  {
    link: '/organization/injury',
    name: 'injury',
    permissions: [
      PermissionsEnum.INJURY_ALL,
      PermissionsEnum.INJURY_CREATE,
      PermissionsEnum.INJURY_DELETE,
      PermissionsEnum.INJURY_FETCH,
      PermissionsEnum.INJURY_UPDATE,
    ],
  },
  {
    link: '/organization/scope',
    name: 'Scope',
    permissions: [
      PermissionsEnum.SCOPE_ALL,
      PermissionsEnum.SCOPE_CREATE,
      PermissionsEnum.SCOPE_DELETE,
      PermissionsEnum.SCOPE_FETCH,
      PermissionsEnum.SCOPE_UPDATE,
    ],
  },

])

const LocationRoutes = ref<Routes[]>([
  {
    link: '/organization/countries',
    name: 'country',
    permissions: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.LOCATION_ORG_ALL,
      PermissionsEnum.LOCATION_ORG_CREATE,
      PermissionsEnum.LOCATION_ORG_UPDATE,
      PermissionsEnum.LOCATION_ORG_DETAILS,
      PermissionsEnum.LOCATION_ORG_DELETE,
      PermissionsEnum.LOCATION_ORG_FETCH,
    ],
  },
  {
    link: '/organization/states',
    name: 'state',
    permissions: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.LOCATION_ORG_ALL,
      PermissionsEnum.LOCATION_ORG_CREATE,
      PermissionsEnum.LOCATION_ORG_UPDATE,
      PermissionsEnum.LOCATION_ORG_DETAILS,
      PermissionsEnum.LOCATION_ORG_DELETE,
      PermissionsEnum.LOCATION_ORG_FETCH,
    ],
  },
  {
    link: '/organization/cities',
    name: 'city',
    permissions: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.LOCATION_ORG_ALL,
      PermissionsEnum.LOCATION_ORG_CREATE,
      PermissionsEnum.LOCATION_ORG_UPDATE,
      PermissionsEnum.LOCATION_ORG_DETAILS,
      PermissionsEnum.LOCATION_ORG_DELETE,
      PermissionsEnum.LOCATION_ORG_FETCH,
    ],
  },
  {
    link: '/organization/areas',
    name: 'location',
    permissions: [
      PermissionsEnum?.ORGANIZATION_EMPLOYEE,
      PermissionsEnum?.LOCATION_ORG_ALL,
      PermissionsEnum.LOCATION_ORG_CREATE,
      PermissionsEnum.LOCATION_ORG_UPDATE,
      PermissionsEnum.LOCATION_ORG_DETAILS,
      PermissionsEnum.LOCATION_ORG_DELETE,
      PermissionsEnum.LOCATION_ORG_FETCH,
    ],
  },
  {
    link: '/organization/project-zone',
    name: 'zones',
    permissions: [
      PermissionsEnum.PROJECT_ZONE_ALL,
      PermissionsEnum.PROJECT_ZONE_CREATE,
      PermissionsEnum.PROJECT_ZONE_DELETE,
      PermissionsEnum.PROJECT_ZONE_FETCH,
      PermissionsEnum.PROJECT_ZONE_UPDATE,
    ],
  },


])

const SelectedOrgRoute = ref<string>('')
const SelectedLocationRoute = ref<string>('')
watch(
  () => route.path,
  (newPath) => {
    SelectedOrgRoute.value = OrganizationRoutes.value.find(item => item.link === newPath)?.name
    SelectedLocationRoute.value = LocationRoutes.value.find(item => item.link === newPath)?.name
  }
)

const orgAccordion = ref<string | null>('1')
const locationAccordion = ref<string | null>('2')


watch(orgAccordion, (val) => {
  orgAccordion.value = val
})
watch(locationAccordion, (val) => {
  locationAccordion.value = val
})
</script>

<template>
  <Accordion v-model:value="orgAccordion">
    <AccordionPanel value="1">
      <AccordionHeader>
        <div class="links-header">
          <GeerIcon />
          {{ $t('organization_setting') }}
        </div>
      </AccordionHeader>

      <AccordionContent>
        <ul>
          <PermissionBuilder v-for="(orgroute, index) in OrganizationRoutes" :key="index" :code="orgroute?.permissions">
            <li>
              <router-link :to="orgroute.link" :class="route?.fullPath?.includes(orgroute.link) ? '' : ''">
                <span>{{ $t(orgroute.name) }}</span>
              </router-link>
            </li>
          </PermissionBuilder>
        </ul>
      </AccordionContent>
    </AccordionPanel>
    <AccordionPanel class="active-panel-out" v-if="SelectedOrgRoute && !orgAccordion">
      <span>{{ SelectedOrgRoute }}</span>
    </AccordionPanel>

  </Accordion>


  <PermissionBuilder :code="[PermissionsEnum?.LOCATION_ORG_ALL]">
    <Accordion v-model:value="locationAccordion">
      <AccordionPanel value="2">
        <AccordionHeader>
          <div class="links-header">
            <GeerIcon />
            {{ $t('location') }}
          </div>
        </AccordionHeader>

        <AccordionContent>
          <ul>
            <!-- <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum?.LOCATION_ORG_ALL,
              PermissionsEnum.LOCATION_ORG_CREATE,
              PermissionsEnum.LOCATION_ORG_UPDATE,
              PermissionsEnum.LOCATION_ORG_DETAILS,
              PermissionsEnum.LOCATION_ORG_DELETE,
              PermissionsEnum.LOCATION_ORG_FETCH,
            ]">
              <li>
                <router-link to="/organization/countries">
                  <span>{{ $t('country') }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.LOCATION_ORG_ALL,
              PermissionsEnum.LOCATION_ORG_CREATE,
              PermissionsEnum.LOCATION_ORG_DELETE,
              PermissionsEnum.LOCATION_ORG_FETCH,
              PermissionsEnum.LOCATION_ORG_UPDATE,
            ]">
              <li>
                <router-link to="/organization/states">

                  <span>{{ $t('state') }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.LOCATION_ORG_ALL,
              PermissionsEnum.LOCATION_ORG_CREATE,
              PermissionsEnum.LOCATION_ORG_DELETE,
              PermissionsEnum.LOCATION_ORG_FETCH,
              PermissionsEnum.LOCATION_ORG_UPDATE,
            ]">
              <li>
                <router-link to="/organization/cities">

                  <span>{{ $t('city') }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
            <PermissionBuilder :code="[
              PermissionsEnum?.ORGANIZATION_EMPLOYEE,
              PermissionsEnum.LOCATION_ORG_ALL,
              PermissionsEnum.LOCATION_ORG_CREATE,
              PermissionsEnum.LOCATION_ORG_DELETE,
              PermissionsEnum.LOCATION_ORG_FETCH,
              PermissionsEnum.LOCATION_ORG_UPDATE,
            ]">
              <li>
                <router-link to="/organization/areas">

                  <span>{{ $t('location') }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
            <PermissionBuilder :code="[
              PermissionsEnum.PROJECT_ZONE_ALL,
              PermissionsEnum.PROJECT_ZONE_CREATE,
              PermissionsEnum.PROJECT_ZONE_DELETE,
              PermissionsEnum.PROJECT_ZONE_FETCH,
              PermissionsEnum.PROJECT_ZONE_UPDATE,
            ]">
              <li>
                <router-link to="/organization/project-zone">

                  <span>{{ $t('zones') }}</span>
                </router-link>
              </li>
            </PermissionBuilder> -->

            <PermissionBuilder v-for="(route, index) in LocationRoutes" :key="index" :code="route.permissions">
              <li>
                <router-link :to="route.link">
                  <span>{{ $t(route.name) }}</span>
                </router-link>
              </li>
            </PermissionBuilder>
          </ul>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel class="active-panel-out" v-if="SelectedLocationRoute && !locationAccordion">
        <span>{{ SelectedLocationRoute }}</span>
      </AccordionPanel>
    </Accordion>
  </PermissionBuilder>

</template>
