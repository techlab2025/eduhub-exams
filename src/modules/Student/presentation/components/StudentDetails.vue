<script setup lang="ts">
  import { computed, h, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import DataStatusBuilder from '@/shared/DataStatues/DataStatusBuilder.vue';
  import DropList from '@/shared/HelpersComponents/DropList.vue';
  import IconPlane from '@/shared/icons/IconPlane.vue';
  import ArchiveIcon from '@/shared/icons/Plan/ArchiveIcon.vue';
  import AddNoteIconSource from '@/assets/icons/Student/add-note.svg';
  import BlockIconSource from '@/assets/icons/Student/block.svg';
  import ForceLogoutIconSource from '@/assets/icons/Student/force-logout.svg';
  import AccordionToggleIcon from '@/shared/icons/questions/AccordionToggleIcon.vue';
  import { StudentStatusEnum } from '../../core/models/student.model';
  import { AddStudentNoteParams } from '../../core/params/add.student.note.params';
  import { ChangeStudentStatusParams } from '../../core/params/change.student.status.params';
  import { ForceLogoutStudentParams } from '../../core/params/force.logout.student.params';
  import { ShowStudentParams } from '../../core/params/show.student.params';
  import StudentController from '../controllers/student.controller';
  import StudentArchiveDialog from '../subComponents/StudentArchiveDialog.vue';
  import StudentBlockDialog from '../subComponents/StudentBlockDialog.vue';
  import StudentForceLogoutDialog from '../subComponents/StudentForceLogoutDialog.vue';
  import StudentNoteDialog from '../subComponents/StudentNoteDialog.vue';
  import IconPerformance from '@/shared/icons/IconPerformance.vue';

  const route = useRoute();
  const { locale, t } = useI18n();
  const controller = StudentController.getInstance();
  const student = computed(() => controller.itemData.value);
  const itemState = computed(() => controller.itemState.value);
  const statusFromRoute = computed<StudentStatusEnum | null>(() => {
    const statusQuery = route.query?.status;
    const status = Array.isArray(statusQuery) ? statusQuery[0] : statusQuery;

    return typeof status === 'string' &&
      Object.values(StudentStatusEnum).includes(status as StudentStatusEnum)
      ? (status as StudentStatusEnum)
      : null;
  });
  const changedStatus = ref<StudentStatusEnum | null>(null);
  const studentStatus = computed(
    () => changedStatus.value ?? statusFromRoute.value ?? student.value?.status,
  );
  const showAllNotes = ref(false);
  const notesExpanded = ref(true);
  const showAllPlacementTests = ref(false);
  const showAllPractices = ref(false);
  const archiveDialogVisible = ref(false);
  const blockDialogVisible = ref(false);
  const forceLogoutDialogVisible = ref(false);
  const noteDialogVisible = ref(false);
  const statusActionLoading = ref(false);
  const forceLogoutLoading = ref(false);
  const noteActionLoading = ref(false);

  const AddNoteIcon = () => h('img', { src: AddNoteIconSource, alt: '' });
  const BlockIcon = () => h('img', { src: BlockIconSource, alt: '' });
  const ForceLogoutIcon = () => h('img', { src: ForceLogoutIconSource, alt: '' });

  const fetchStudent = () => controller.fetchOne(new ShowStudentParams(Number(route.params.id)));
  const retryFetchStudent = async () => {
    await fetchStudent();
  };
  const changeStatus = async (
    status: StudentStatusEnum,
    blockReasonId?: number,
    reason?: string,
  ) => {
    if (!student.value || statusActionLoading.value) return;

    statusActionLoading.value = true;
    try {
      await controller.changeStatus(
        new ChangeStudentStatusParams(student.value.id, status, blockReasonId, reason),
      );
      changedStatus.value = status;
      archiveDialogVisible.value = false;
      blockDialogVisible.value = false;
      await fetchStudent();
    } finally {
      statusActionLoading.value = false;
    }
  };
  const confirmArchive = () => changeStatus(StudentStatusEnum.ARCHIVE);
  const confirmBlock = (blockReasonId: number, reason: string) =>
    changeStatus(StudentStatusEnum.BLOCK, blockReasonId, reason);
  const confirmForceLogout = async () => {
    if (!student.value || forceLogoutLoading.value) return;

    forceLogoutLoading.value = true;
    try {
      await controller.forceLogout(new ForceLogoutStudentParams(student.value.id));
      forceLogoutDialogVisible.value = false;
    } finally {
      forceLogoutLoading.value = false;
    }
  };
  const addNote = async (payload: { studentId: number; note: string }) => {
    if (noteActionLoading.value) return;

    noteActionLoading.value = true;
    try {
      await controller.addNote(new AddStudentNoteParams(payload.studentId, payload.note));
      noteDialogVisible.value = false;
      await fetchStudent();
    } finally {
      noteActionLoading.value = false;
    }
  };
  const actionList = computed(() => {
    if (!student.value) return [];

    const archiveAction = {
      text: studentStatus.value === StudentStatusEnum.ARCHIVE ? t('un_archive') : t('archive'),
      icon: ArchiveIcon,
      action: () =>
        studentStatus.value === StudentStatusEnum.ARCHIVE
          ? changeStatus(StudentStatusEnum.ACTIVE)
          : (archiveDialogVisible.value = true),
    };

    if (studentStatus.value === StudentStatusEnum.ARCHIVE) return [archiveAction];

    const blockAction = {
      text: studentStatus.value === StudentStatusEnum.BLOCK ? t('un_block') : t('block'),
      icon: BlockIcon,
      action: () =>
        studentStatus.value === StudentStatusEnum.BLOCK
          ? changeStatus(StudentStatusEnum.ACTIVE)
          : (blockDialogVisible.value = true),
      danger: true,
    };

    if (studentStatus.value === StudentStatusEnum.BLOCK) {
      return [archiveAction, blockAction];
    }

    return [
      archiveAction,
      {
        text: t('add_note'),
        icon: AddNoteIcon,
        action: () => (noteDialogVisible.value = true),
      },
      {
        text: t('force_logout'),
        icon: ForceLogoutIcon,
        action: () => (forceLogoutDialogVisible.value = true),
      },
      blockAction,
    ];
  });
  const valueOrDash = (value: unknown) =>
    value === null || value === undefined || value === '' ? '—' : String(value);
  const formatBlockDate = (value: string) => {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-EG' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  const verificationValue = (verified: boolean) => (verified ? 'verified' : 'not_verified');
  const money = (value: number) => `${value.toLocaleString()} LE`;
  const visibleNotes = computed(() =>
    showAllNotes.value ? (student.value?.notes ?? []) : (student.value?.notes ?? []).slice(0, 5),
  );
  const visiblePlacementTests = computed(() =>
    showAllPlacementTests.value
      ? (student.value?.placementTests ?? [])
      : (student.value?.placementTests ?? []).slice(0, 1),
  );
  const visiblePractices = computed(() =>
    showAllPractices.value
      ? (student.value?.practicesPlan ?? [])
      : (student.value?.practicesPlan ?? []).slice(0, 1),
  );
  const registrationRows = computed(() => {
    const data = student.value?.registration;
    if (!data) return [];
    return [
      { label: 'register_date', value: data.registerDate },
      { label: 'authentication_method', value: data.authenticationMethod },
      { label: 'email', value: data.email },
      { label: 'email_verified', value: verificationValue(data.emailVerified), state: true },
      { label: 'phone_verified', value: verificationValue(data.phoneVerified), state: true },
    ];
  });
  const applicationRows = computed(() => {
    const data = student.value?.applicationInformation;
    if (!data) return [];
    return [
      { label: 'registration_method', value: data.registrationMethod },
      { label: 'device_used', value: data.deviceUsed },
      { label: 'operation_system', value: data.operationSystem },
      { label: 'app_version', value: data.appVersion },
      { label: 'current_status', value: data.currentStatus, state: true },
      { label: 'last_seen', value: data.lastSeen },
    ];
  });
  const showAllSubjects = ref(false);
  const subjectsList = computed(() => {
    if (showAllSubjects.value) return student.value?.subjects;
    return student.value?.subjects.slice(0, 3);
  });
  const handleShowMore = () => {
    showAllSubjects.value = !showAllSubjects.value;
  };
  onMounted(fetchStudent);
</script>

<template>
  <DataStatusBuilder :controller="itemState" :on-retry="retryFetchStudent" use-skeleton>
    <template #success>
      <main v-if="student" class="student-details-page">
        <aside class="student-details-sidebar">
          <article class="student-profile-card">
            <header class="student-profile-header">
              <img v-if="student.image" :src="student.image" :alt="student.name" />
              <span v-else class="student-profile-avatar" aria-hidden="true">
                {{ student.name.charAt(0) }}
              </span>
              <div>
                <div class="student-profile-name">
                  <h1>{{ student.name }}</h1>
                  <span class="student-online-dot"></span>
                  <span>{{ $t(`student_status_${studentStatus}`) }}</span>
                </div>
                <p>{{ student.serial }}</p>
              </div>
            </header>

            <div class="student-badges">
              <span class="student-rank-badge">{{ valueOrDash(student.rank) }}</span>
              <span class="student-points-badge">{{ student.points }} {{ $t('points') }}</span>
            </div>

            <dl class="student-profile-list">
              <div>
                <dt>{{ $t('phone_number') }}</dt>
                <dd>{{ valueOrDash(student.phone) }}</dd>
              </div>
              <div>
                <dt>{{ $t('education_type') }}</dt>
                <dd>{{ valueOrDash(student.educationType?.title) }}</dd>
              </div>
              <div>
                <dt>{{ $t('education_stage') }}</dt>
                <dd>{{ valueOrDash(student.educationStage?.title) }}</dd>
              </div>
              <div style="border: none">
                <dt>{{ $t('grade_level') }}</dt>
                <dd>{{ valueOrDash(student.grade?.title) }}</dd>
              </div>
              <div class="parents">
                <div>
                  <dt>{{ $t('parent_name') }}</dt>
                  <dd>{{ valueOrDash(student.parentName) }}</dd>
                </div>
                <div>
                  <dt>{{ $t('parent_phone') }}</dt>
                  <dd>{{ valueOrDash(student.parentPhone) }}</dd>
                </div>
              </div>
            </dl>
          </article>

          <article class="student-info-card">
            <h2 class="registration_security">{{ $t('registration_security') }}</h2>
            <dl class="student-info-list">
              <div v-for="row in registrationRows" :key="row.label">
                <dt>{{ $t(row.label) }}</dt>
                <dd :class="{ 'student-state-value': row.state }">
                  {{ row.state ? $t(row.value) : valueOrDash(row.value) }}
                </dd>
              </div>
            </dl>
          </article>

          <article class="student-info-card">
            <h2 class="registration_security">{{ $t('application_information') }}</h2>
            <dl class="student-info-list">
              <div v-for="row in applicationRows" :key="row.label">
                <dt>{{ $t(row.label) }}</dt>
                <dd :class="{ 'student-current-offline': row.label === 'current_status' }">
                  {{ valueOrDash(row.value) }}
                </dd>
              </div>
            </dl>
          </article>
        </aside>

        <section class="student-details-content">
          <article class="student-content-card student-account-card">
            <header class="student-card-heading">
              <div>
                <h2>{{ $t('account_status') }}</h2>
                <p>{{ $t('account_status_description') }}</p>
              </div>
              <DropList :action-list="actionList" variant="student">
                <template #icon>
                  <button
                    type="button"
                    class="student-more-button"
                    :aria-label="$t('more_actions')"
                  >
                    ⋮
                  </button>
                </template>
              </DropList>
            </header>
            <div
              class="student-account-message"
              :class="{
                active: studentStatus === StudentStatusEnum.ACTIVE,
                archived: studentStatus === StudentStatusEnum.ARCHIVE,
                blocked: studentStatus === StudentStatusEnum.BLOCK,
              }"
              role="status"
            >
              <p class="student-account-message-title">
                <span class="student-account-message-icon" aria-hidden="true">
                  {{ studentStatus === StudentStatusEnum.ARCHIVE ? 'i' : '!' }}
                </span>
                {{
                  $t(
                    studentStatus === StudentStatusEnum.ACTIVE
                      ? 'student_account_active'
                      : studentStatus === StudentStatusEnum.ARCHIVE
                        ? 'student_account_archived'
                        : 'student_account_blocked',
                  )
                }}
              </p>

              <template v-if="studentStatus === StudentStatusEnum.BLOCK">
                <dl class="student-account-block-details">
                  <div>
                    <dt>{{ $t('student_blocked_by') }}:</dt>
                    <dd>{{ valueOrDash(student.blockedBy?.name) }}</dd>
                  </div>
                  <div>
                    <dt>{{ $t('student_blocked_since') }}:</dt>
                    <dd>{{ formatBlockDate(student.blockDate) }}</dd>
                  </div>
                </dl>
                <p class="student-account-block-reason">
                  <strong>{{ $t('student_block_reason') }}:</strong>
                  {{ valueOrDash(student.reason) }}
                </p>
              </template>
            </div>
          </article>

          <article class="student-content-card">
            <h2 class="student-section-title">
              <IconPlane />
              {{ $t('plans_finance') }}
            </h2>
            <div class="student-finance-grid">
              <div>
                <span>{{ $t('current_plan') }}</span>
                <strong>{{ valueOrDash(student.plan?.title) }}</strong>
                <small>{{
                  $t('expire_date', { date: valueOrDash(student.plan?.expireDate) })
                }}</small>
              </div>
              <div v-if="student.subjects.length > 0" class="subject-container">
                <span
                  >{{ $t('num of subject:') }}
                  <small class="num-of-subjects">{{ student.subjects.length }}</small></span
                >
                <div class="subjects-content">
                  <div v-for="subject in subjectsList" :key="subject.id" class="subjects">
                    <strong>{{ subject.title }}</strong>
                  </div>
                  <span
                    v-if="student?.subjects?.length > 3"
                    class="more-subjects"
                    @click="handleShowMore"
                    >{{ showAllSubjects ? $t('show_less') : $t('show_more') }}</span
                  >
                </div>
              </div>
              <div>
                <span>{{ $t('total_paid_for_all_plans') }}</span>
                <strong>{{ money(student.plan?.totalPaid ?? 0) }}</strong>
                <small>{{ valueOrDash(student.plan?.paymentMethod) }}</small>
              </div>
            </div>
          </article>

          <article class="student-content-card">
            <h2 class="student-section-title">
              <IconPerformance />{{ $t('performance_snapshot') }}
            </h2>
            <div class="student-performance-grid">
              <div>
                <span>{{ $t('total_placement_tests') }}</span>
                <strong>{{ student.performance.totalPlacementTests }}</strong>
              </div>
              <div>
                <span>{{ $t('placement_tests_this_month') }}</span>
                <strong>{{ student.performance.placementTestsThisMonth }}</strong>
              </div>
              <div>
                <span>{{ $t('total_practices_plan') }}</span>
                <strong>{{ student.performance.totalPracticesPlan }}</strong>
              </div>
              <div>
                <span>{{ $t('practices_plan_this_month') }}</span>
                <strong>{{ student.performance.totalPracticesPlanThisMonth }}</strong>
              </div>
            </div>
          </article>

          <article class="student-content-card student-history-card">
            <header class="student-card-heading">
              <h2>{{ $t('subscription_history') }}</h2>
              <button type="button" class="student-show-button">{{ $t('show_all') }}</button>
            </header>
            <dl v-if="student.plan" class="student-subscription-summary">
              <div>
                <dt>{{ $t('plan') }}</dt>
                <dd>{{ student.plan.title }}</dd>
              </div>
              <div>
                <dt>{{ $t('subscription_date') }}</dt>
                <dd>{{ valueOrDash(student.plan.subscribeDate) }}</dd>
              </div>
              <div>
                <dt>{{ $t('payment_method') }}</dt>
                <dd>{{ valueOrDash(student.plan.paymentMethod) }}</dd>
              </div>
            </dl>
          </article>

          <article class="student-content-card student-results-card">
            <header class="student-card-heading">
              <h2>
                {{ $t('placement_tests_label') }}
                <span>({{ student.placementTests.length }})</span>
              </h2>
              <button
                type="button"
                class="student-show-button"
                @click="showAllPlacementTests = !showAllPlacementTests"
              >
                {{ $t(showAllPlacementTests ? 'show_less' : 'show_all') }}
              </button>
            </header>
            <div class="student-results-table">
              <div class="student-results-head">
                <span>{{ $t('last_placement_tests') }}</span>
                <span>{{ $t('correct_answer_label_short') }}</span>
                <span>{{ $t('wrong_answer_label') }}</span>
              </div>
              <div v-for="test in visiblePlacementTests" :key="test.id" class="student-results-row">
                <span>{{ test.title }}</span>
                <strong>{{ test.correctCount }}</strong>
                <strong>{{ test.wrongCount }}</strong>
              </div>
              <p v-if="student.placementTests.length === 0" class="student-empty-row">
                {{ $t('no_placement_tests') }}
              </p>
            </div>
          </article>

          <article class="student-content-card student-results-card">
            <header class="student-card-heading">
              <h2>
                {{ $t('practices_plan') }}
                <span>({{ student.practicesPlan.length }})</span>
              </h2>
              <button
                type="button"
                class="student-show-button"
                @click="showAllPractices = !showAllPractices"
              >
                {{ $t(showAllPractices ? 'show_less' : 'show_all') }}
              </button>
            </header>
            <div class="student-results-table">
              <div class="student-results-head">
                <span>{{ $t('last_practices_plan') }}</span>
                <span>{{ $t('correct_answer_label_short') }}</span>
                <span>{{ $t('wrong_answer_label') }}</span>
              </div>
              <div v-for="plan in visiblePractices" :key="plan.id" class="student-results-row">
                <span>{{ plan.title }}</span>
                <strong>{{ plan.correctCount }}</strong>
                <strong>{{ plan.wrongCount }}</strong>
              </div>
              <p v-if="student.practicesPlan.length === 0" class="student-empty-row">
                {{ $t('no_practices_plan') }}
              </p>
            </div>
          </article>

          <article class="student-content-card student-schedule-card">
            <header class="student-card-heading">
              <h2>
                {{ $t('student_schedules') }}
                <span>({{ student.studentSchedules.length }})</span>
              </h2>
              <button type="button" class="student-show-button">{{ $t('show_details') }}</button>
            </header>
          </article>

          <article id="notes" class="student-content-card student-notes-card">
            <header class="student-card-heading">
              <h2>
                <button
                  type="button"
                  class="student-notes-trigger"
                  :aria-expanded="notesExpanded"
                  aria-controls="student-notes-panel"
                  @click="notesExpanded = !notesExpanded"
                >
                  {{ $t('notes') }}
                  <span>({{ student.notes.length }})</span>
                  <AccordionToggleIcon
                    class="student-notes-chevron"
                    :class="{ 'student-notes-chevron-collapsed': !notesExpanded }"
                    aria-hidden="true"
                  />
                </button>
              </h2>
            </header>
            <div v-show="notesExpanded" id="student-notes-panel">
              <ul>
                <li v-for="note in visibleNotes" :key="note.id">
                  <div class="student-note-meta">
                    <span class="student-note-avatar" aria-hidden="true">
                      {{ note.createdBy?.name.charAt(0) ?? 'A' }}
                    </span>
                    <strong>{{ valueOrDash(note.createdBy?.name) }}</strong>
                    <time>{{ valueOrDash(note.createdAt) }}</time>
                  </div>
                  <p>{{ note.note }}</p>
                </li>
              </ul>
              <p v-if="student.notes.length === 0" class="student-empty-row">
                {{ $t('no_notes') }}
              </p>
              <button
                v-if="student.notes.length > 5"
                type="button"
                class="student-notes-toggle"
                @click="showAllNotes = !showAllNotes"
              >
                {{ $t(showAllNotes ? 'show_less' : 'show_all') }}
              </button>
            </div>
          </article>
        </section>
      </main>

      <StudentArchiveDialog
        v-model="archiveDialogVisible"
        :loading="statusActionLoading"
        :has-active-subscription="student?.hasActiveSubscription ?? false"
        @confirm="confirmArchive"
      />
      <StudentBlockDialog
        v-model="blockDialogVisible"
        :loading="statusActionLoading"
        :has-active-subscription="student?.hasActiveSubscription ?? false"
        @confirm="confirmBlock"
      />
      <StudentForceLogoutDialog
        v-model="forceLogoutDialogVisible"
        :loading="forceLogoutLoading"
        @confirm="confirmForceLogout"
      />
      <StudentNoteDialog
        v-model="noteDialogVisible"
        :student-id="student?.id ?? null"
        :loading="noteActionLoading"
        @save="addNote"
      />
    </template>
  </DataStatusBuilder>
</template>

<style scoped lang="scss">
  .more-subjects {
    color: #4faf7c !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    cursor: pointer !important;
    text-decoration: underline !important;
  }

  .subject-container {
    span {
      color: #5d5d5d;
      font-weight: 500;
      font-size: 14px;
    }

    .num-of-subjects {
      color: #4faf7c;
      font-size: 14px;
      font-weight: 700;
    }

    .subjects-content {
      display: flex;
      flex-direction: row !important;
      flex-wrap: wrap;
      gap: 15px;

      .subjects {
        strong {
          color: #8a8a8a;
          font-weight: 500;
          font-size: 14px;
          font-family: var(--font-family);
          position: relative;

          &::before {
            position: absolute;
            content: '•';
            top: 50%;
            left: -10px;
            transform: translateY(-50%);
            color: #8a8a8a;
          }
        }
      }
    }
  }

  .registration_security {
    border-bottom: 2px dashed #24385c1a;
    padding-bottom: 0.8rem;
    margin-bottom: 0.5rem !important;
  }

  .parents {
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(230, 230, 230, 1);
    border-radius: 20px;
    padding: 1rem !important;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.07);

    > div {
      width: 100%;
    }
  }

  .student-details-page {
    display: grid;
    grid-template-columns: minmax(260px, 31%) minmax(0, 1fr);
    gap: 16px;
    color: var(--standard-black);
    font-family: var(--font-family);
  }

  .student-details-sidebar,
  .student-details-content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .student-profile-card,
  .student-info-card,
  .student-content-card {
    background: var(--standard-white);
    border: 1px solid var(--input-border-color);
    border-radius: 20px;
  }

  .student-profile-card,
  .student-info-card {
    padding: 16px;
  }

  .student-profile-header {
    display: flex;
    align-items: center;
    gap: 12px;

    img,
    .student-profile-avatar {
      width: 64px;
      height: 64px;
      flex: 0 0 64px;
      border-radius: 50%;
    }

    img {
      object-fit: cover;
    }

    p {
      margin: 6px 0 0;
      color: var(--gray-text);
      font-size: 13px;
    }
  }

  .student-profile-avatar {
    display: grid;
    place-items: center;
    color: var(--primary-green);
    background: var(--PrimaryColor-alpha-8);
    font-size: 24px;
    font-weight: 700;
  }

  .student-profile-name {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;

    h1 {
      margin: 0;
      font-size: 17px;
      font-weight: 700;
    }

    span:last-child {
      color: var(--primary-green);
      font-size: 12px;
    }
  }

  .student-online-dot {
    width: 5px;
    height: 5px;
    background: var(--primary-green);
    border-radius: 50%;
  }

  .student-badges {
    margin-block: 16px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;

    span {
      min-height: 34px;
      padding: 8px 10px;
      display: grid;
      place-items: center;
      border-radius: var(--radius-full);
      font-size: 12px;
      font-weight: 600;
      text-align: center;
    }
  }

  .student-rank-badge {
    color: var(--btn-gold);
    background: var(--warning-light-alpha-50);
  }

  .student-points-badge {
    color: var(--primary-green);
    background: var(--PrimaryColor-alpha-8);
  }

  .student-profile-list,
  .student-info-list,
  .student-subscription-summary {
    margin: 0;

    div {
      padding-block: 11px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid var(--input-border-color);

      &:last-child {
        padding-bottom: 0;
        border-bottom: 0;
      }
    }

    dt {
      color: #8a8a8a;
      font-size: 14px;
      font-weight: 500;
      font-family: 'Medium';
    }

    dd {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      font-family: 'demi';
      text-align: end;
    }
  }

  .student-info-card h2,
  .student-card-heading h2,
  .student-section-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    font-family: 'demi';
    color: rgba(22, 36, 55, 1);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .student-state-value {
    color: var(--primary-green);
  }

  .student-current-offline {
    color: var(--danger-alt);
  }

  .student-content-card {
    padding: 16px;
  }

  .student-card-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    p {
      margin: 4px 0 0;
      color: var(--gray-text);
      font-size: 14px;
      font-family: 'Medium';
      font-weight: 500;
    }

    h2 span {
      color: var(--primary-green);
      font-weight: 500;
    }
  }

  .student-more-button {
    width: 28px;
    height: 28px;
    padding: 0;
    color: var(--standard-black);
    background: transparent;
    border: 0;
    cursor: pointer;
    font-size: 20px;
  }

  .student-account-message {
    margin: 14px 0 0;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    color: var(--standard-black);
    background: var(--PrimaryColor-alpha-8);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Medium';

    &.archived {
      background: rgba(184, 184, 184, 1);
    }

    &.blocked {
      color: var(--danger-alt);
      background: var(--danger-light-alt);
    }
  }

  .student-account-message-title {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .student-account-message-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    display: grid;
    place-items: center;
    color: var(--primary-green);
    border: 1px solid var(--primary-green);
    border-radius: 50%;
    font-size: 10px;
    font-family: var(--font-family);
    line-height: 1;
  }

  .student-account-message.archived .student-account-message-icon {
    color: var(--standard-black);
    border-color: var(--standard-black);
  }

  .student-account-message.blocked .student-account-message-icon {
    color: var(--danger-alt);
    border-color: var(--danger-alt);
  }

  .student-account-block-details {
    margin: 6px 0 0;
    margin-inline-start: 24px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 32px;

    div {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    dt {
      font-size: 12px;
      font-weight: 600;
    }

    dd {
      margin: 0;
      color: var(--standard-black);
      font-size: 12px;
      font-weight: 500;
    }
  }

  .student-account-block-reason {
    margin: 8px 0 0;
    padding-top: 8px;
    color: var(--standard-black);
    border-top: 1px dashed var(--danger-border-light);
    font-size: 12px;

    strong {
      color: var(--danger-alt);
    }
  }

  .student-section-title {
    margin-bottom: 14px;
  }

  .student-finance-grid,
  .student-performance-grid {
    display: grid;
    gap: 12px;

    > div {
      min-width: 0;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      background: var(--background-color-soft-light);
      border-radius: 14px;
    }

    span {
      color: rgba(93, 93, 93, 1);
      font-size: 16px;
      font-weight: 500;
      font-family: 'Medium';
    }

    small {
      color: rgba(138, 138, 138, 1);
      font-size: 14px;
      font-weight: 500;
      font-family: 'Medium';
    }

    strong {
      color: var(--standard-black);
      font-size: 18px;
      font-weight: 700;
      font-family: 'bold';
    }
  }

  .student-finance-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    > div:first-child strong {
      color: var(--primary-green);
    }
  }

  .student-performance-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .student-show-button {
    min-width: 100px;
    min-height: 34px;
    padding: 7px 33px;
    color: rgba(18, 18, 18, 1);
    background: rgba(250, 250, 250, 1);
    border: 1px solid rgba(230, 230, 230, 1);
    border-radius: var(--radius-full);
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    font-family: 'demi';
  }

  .student-subscription-summary {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;

    div {
      padding: 10px;
      align-items: flex-start;
      flex-direction: column;
      background: var(--background-color-soft-light);
      border: 0;
      border-radius: 10px;
    }

    dt {
      font-size: 14px;
      color: rgba(48, 48, 48, 1);
      font-family: 'demi';
      font-weight: 600;
      margin-bottom: 4px;
    }

    dd {
      text-align: start;
    }
  }

  .student-results-table {
    margin-top: 12px;
    overflow: hidden;
    border: 1px solid var(--input-border-color);
    border-radius: 14px;
  }

  .student-results-head,
  .student-results-row {
    padding: 12px 14px;
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) repeat(2, minmax(80px, 1fr));
    gap: 12px;
    font-size: 12px;
  }

  .student-results-head {
    background: var(--background-color-soft-light);
    font-weight: 600;
  }

  .student-results-row {
    border-top: 1px solid var(--input-border-color);

    strong:nth-child(2) {
      color: var(--primary-green);
    }

    strong:nth-child(3) {
      color: var(--danger-alt);
    }
  }

  .student-notes-card ul {
    margin: 14px 0 0;
    padding: 0;
    display: grid;
    gap: 10px;
    list-style: none;

    li {
      padding: 12px;
      border: 1px solid var(--input-border-color);
      border-radius: 12px;

      p {
        margin: 8px 0 0;
        line-height: 1.5;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Medium';
      }
    }
  }

  .student-notes-card .student-card-heading h2 {
    width: 100%;
  }

  .student-notes-trigger {
    width: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: inherit;
    background: transparent;
    border: 0;
    cursor: pointer;
    font: inherit;
    text-align: start;
  }

  .student-notes-chevron {
    flex: 0 0 auto;
    margin-inline-start: auto;
    transition: transform 0.2s ease;
  }

  .student-notes-chevron-collapsed {
    transform: rotate(180deg);
  }

  .student-note-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;

    strong {
      font-weight: 500;
      font-family: 'Medium';
      font-size: 16px;
    }

    time {
      color: var(--gray-text);
      font-weight: 500;
      font-family: 'Medium';
      font-size: 14px;
    }
  }

  .student-note-avatar {
    width: 24px;
    height: 24px;
    display: grid;
    place-items: center;
    color: var(--primary-green);
    background: var(--PrimaryColor-alpha-8);
    border-radius: 50%;
    font-weight: 700;
  }

  .student-notes-toggle {
    width: 100%;
    height: 40px;
    margin-top: 12px;
    color: var(--primary-green);
    background: var(--standard-white);
    border: 1px solid var(--primary-green);
    border-radius: var(--radius-full);
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
  }

  .student-empty-row {
    margin: 0;
    padding: 16px;
    color: var(--gray-text);
    font-size: 12px;
    text-align: center;
  }

  @media (max-width: 1024px) {
    .student-details-page {
      grid-template-columns: 1fr;
    }

    .student-details-sidebar {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .student-profile-card {
      grid-row: span 2;
    }
  }

  @media (max-width: 680px) {
    .student-details-sidebar,
    .student-finance-grid,
    .student-performance-grid,
    .student-subscription-summary {
      grid-template-columns: 1fr;
    }

    .student-results-head,
    .student-results-row {
      grid-template-columns: minmax(0, 1fr) repeat(2, 72px);
      font-size: 11px;
    }

    .student-card-heading {
      align-items: flex-start;
    }
  }
</style>
