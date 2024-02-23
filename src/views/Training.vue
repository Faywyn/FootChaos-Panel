<script lang="ts">
import { defineComponent } from 'vue'
import { apiManager } from '../main';
import type { apiDataTrainingType } from '../dev/types';


export default defineComponent({
  data() {
    return {
      isTraining: false,
      currentTraining: -1,
    }
  },

  methods: {
    apiTraining: function (force: boolean) {
      apiManager.call<apiDataTrainingType>("/training", {}, force)
        .then((r) => {
          this.isTraining = r.isTraining;
          this.currentTraining = r.id;
        })
        .catch((e) => { console.log(e); alert(e.code) })
    },
    trainingEnd: function () {
      this.isTraining = false;
      this.currentTraining = -1;
      this.apiTraining(true);
    },
    trainingStart: function (id: number) {
      this.isTraining = true;
      this.currentTraining = id;
      this.apiTraining(true);
    }
  },

  beforeMount: function () {
    this.apiTraining(false);
  },
  mounted: function () {
    setTimeout(() => this.apiTraining(false), 5000)
  },
})
</script>

<script lang="ts" setup>
import CreateTraining from '../components/CreateTraining.vue'
import TableManager from '../components/TableManager.vue'
</script>

<template>
  <main class="training-page">
    <h1>AI Training {{ isTraining ? `(training ${currentTraining} online)` : "" }}</h1>

    <hr />

    <h2>Setup</h2>
    <CreateTraining />
    <h2>Trainings</h2>
    <TableManager :currentTraining="currentTraining" :isTraining="isTraining" @trainingEnd="trainingEnd()"
      @trainingStart="(id) => trainingStart(id)" />

  </main>
</template>

<style scoped>
main {
  background-color: var(--dark);
  color: #ffffff;
  width: 100%;

  hr {
    margin-bottom: 3rem;
  }
}
</style>
