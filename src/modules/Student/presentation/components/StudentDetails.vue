<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import StudentController from '../controllers/student.controller';
  import { ShowStudentParams } from '../../core/params/student.params';
  const route = useRoute();
  const controller = StudentController.getInstance();
  const sections = computed(() => {
    const details = controller.itemData.value?.details;
    if (!details) return [];
    return [
      { key: 'registration', value: details.registration },
      { key: 'application_information', value: details.application_information },
      { key: 'performance', value: details.performance },
      { key: 'plan', value: details.plan },
    ];
  });
  onMounted(() => controller.fetchOne(new ShowStudentParams(Number(route.params.id))));
</script>
<template>
  <section v-if="controller.itemData.value" class="student-details">
    <header>
      <img
        v-if="controller.itemData.value.image"
        :src="controller.itemData.value.image"
        :alt="controller.itemData.value.name"
      />
      <div>
        <h2>{{ controller.itemData.value.name }}</h2>
        <p>{{ controller.itemData.value.serial }}</p>
      </div>
    </header>
    <div class="details-grid">
      <article v-for="section in sections" :key="section.key">
        <h3>{{ $t(section.key) }}</h3>
        <dl>
          <template v-for="(value, key) in section.value" :key="key"
            ><dt>{{ $t(String(key)) }}</dt>
            <dd>{{ value }}</dd></template
          >
        </dl>
      </article>
    </div>
    <article>
      <h3>{{ $t('notes') }}</h3>
      <ul>
        <li v-for="note in controller.itemData.value.details.notes ?? []" :key="note.id">
          {{ note.note }} — {{ note.created_by?.name }}
        </li>
      </ul>
    </article>
  </section>
</template>
<style scoped lang="scss">
  .student-details {
    display: grid;
    gap: var(--xl-size-base);
  }

  .student-details header,
  article {
    padding: var(--xl-size-1);
    background: var(--bg-main);
    border: 1px solid var(--border-weak);
    border-radius: var(--radius-lg);
  }

  .student-details header {
    display: flex;
    gap: var(--xl-size-base);
    align-items: center;
  }

  .student-details header img {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    object-fit: cover;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--xl-size-base);
  }

  dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--xs-size-3) var(--xs-size);
  }

  dt {
    font-weight: 700;
  }
</style>
