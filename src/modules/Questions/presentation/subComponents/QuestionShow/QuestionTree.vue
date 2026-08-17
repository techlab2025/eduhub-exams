<script setup lang="ts">
  import Arrow from '@/shared/icons/Question/Arrow.vue';
  import NextStepIcon from '@/shared/icons/Question/NextStepIcon.vue';
  import type ShowQuestionsModel from '@/modules/Questions/core/models/show.questions.model';
  import Articlearrow from '@/shared/icons/articlearrow.vue';

  const { questionData } = defineProps<{ questionData: ShowQuestionsModel }>();

  const getSubjectPath = (item: ShowQuestionsModel) => {
    if (!item?.subjectTree) return '';
    const parts = item.subjectTree.full_title?.split(/\s*->\s*/);
    return parts?.map((subject) => subject.trim()) ?? '';
  };
</script>

<template>
  <div class="question-tree-card">
    <!-- Subject -->
    <div class="section">
      <h4>Subject</h4>

      <div class="subject-box">
        <div class="subject-info">
          <div class="subject-cell">
            <div class="parent-subject-curriculum">
              <span
                v-for="(subject, index) in getSubjectPath(questionData)"
                :key="index"
                class="subject-curriculum"
              >
                <p>{{ subject }}</p>
                <Articlearrow
                  v-if="index < getSubjectPath(questionData).length - 1"
                  class="arrow-icon"
                />
              </span>
            </div>
            <div>
              <span class="subject-cycle">
                <Arrow />
                <span class="subject-lang">{{ questionData?.subjectTree?.title }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sequence -->
    <div class="section">
      <h4>Question Sequence</h4>

      <div class="sequence-list">
        <div class="sequence-item">
          {{ questionData.sequenceTree?.title }}
        </div>

        <span v-for="(item, index) in questionData?.sequenceTree?.children" :key="index">
          {{ item.title }}
        </span>
      </div>
    </div>

    <!-- Documents -->
    <div class="section">
      <h4>Documents</h4>

      <div class="document">
        <h5>
          {{ questionData.questionDocuments![0]?.title }}
        </h5>

        <NextStepIcon v-if="questionData?.questionDocuments![0]?.source" class="arrow-next" />
        <p>
          Source:
          {{ questionData.questionDocuments![0]?.source }}
        </p>
      </div>
    </div>

    <!-- Skills -->
    <div v-if="questionData.skills?.length" class="section">
      <h4>Skills</h4>

      <ul class="skills">
        <li v-for="skill in questionData?.skills" :key="skill.id">
          <span class="dot"></span>

          {{ skill.skill }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .document {
    position: relative;

    h5 {
      padding: 0 1rem;
    }

    p {
      padding: 0 1.5rem;
    }

    .arrow-next {
      position: absolute;
      left: 5px;
      top: 55%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background-color: var(--color-main-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
</style>
