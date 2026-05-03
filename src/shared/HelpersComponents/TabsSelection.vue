<script setup lang="ts">
  import BlueBack from '@/assets/images/BgGroup.png';
  import yelloecircle from '@/assets/images/yelloecircle.png';
  import { onMounted, ref } from 'vue';
  import { watch } from 'vue';
  import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController';
  import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams';
  import { useRouter } from 'vue-router';

  const emit = defineEmits(['update:data']);
  const router = useRouter();
  const props = defineProps<{
    ProjectId: number;
  }>();
  const updateData = (data) => {
    console.log(data.target.value, 'data.target.value');
    emit('update:data', data.target.value);
  };
  const fetchMyZonesController = FetchMyZonesController.getInstance();
  const state = ref(fetchMyZonesController.state.value);
  const SelectedLocation = ref(state.value.data?.[0]?.ProjectZoneId);

  const FetchMyZones = async () => {
    const fetchMyZonesParams = new FetchMyZonesParams(props.ProjectId);
    await fetchMyZonesController.FetchMyZones(fetchMyZonesParams, router);
  };
  onMounted(() => {
    FetchMyZones();
  });

  watch(
    () => fetchMyZonesController.state.value,
    (newState) => {
      state.value = newState;
    },
  );

  watch(
    () => props.ProjectId,
    () => {
      FetchMyZones();
    },
  );
  watch(
    () => state.value.data,
    (zones) => {
      if (zones && zones.length > 0) {
        SelectedLocation.value = zones[0].ProjectZoneId;
        emit('update:data', SelectedLocation.value);
      }
    },
    { immediate: true },
  );
</script>
<template>
  <div class="w-full">
    <div class="tabs-selction-container">
      <div class="tabs-selction-content">
        <div class="select-container">
          <div
            v-for="zoon in state.data"
            :key="zoon.ProjectZoneId"
            class="select-item"
            :class="SelectedLocation === zoon.ProjectZoneId ? 'active' : ''"
          >
            <div class="left-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="left-yellow" :src="yelloecircle" alt="yellow" />
            </div>
            <input
              :id="`radio-${zoon.ProjectZoneId}`"
              type="radio"
              name="radio"
              :value="zoon.ProjectZoneId"
              @change="updateData"
            />
            <label
              v-if="zoon?.title"
              class="item"
              :for="`radio-${zoon.ProjectZoneId}`"
              @click="SelectedLocation = zoon.ProjectZoneId"
              >{{ zoon.title || `--` }}</label
            >
            <div class="right-back-img">
              <img :src="BlueBack" alt="blue" />
              <img class="right-yellow" :src="yelloecircle" alt="blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
