<script setup lang="ts">

  const {note} = defineProps<{
    note:string
  }>()
</script>

<template>
  <div class="question-review-reject-wrapper">
    <div class="card-content">
      <div class="question-review-reject-header">
        <h2> reject Reason</h2>
        <p>{{ note || 'no Reason For Reject ' }}</p>
      </div>

      <!-- <div class="question-review-reject-body">
        <div class="reject-item">
          <h4>Reject By :</h4>
          <p>Ai .</p>
        </div>
        <div class="reject-item">
          <h4>rejected in:</h4>
          <p>2 / 11 / 2006</p>
        </div>
      </div> -->
    </div>
    <div class="actions">
       <!--  <router-link class="approve-btn btn btn-primary" :to="`/questions/edit/${route.params.id}`">
        <EditIcon />
        Edit question
      </router-link>-->
      <!-- <button class="btn btn-edit">
        <ReloadIcon />
        send Question to review again
      </button> -->
    </div>
  </div>
</template>
