<template>
  <main>
    <h1>Analysis {{ selectedId }}</h1>
    <hr />
    <StatChart :trainingItems="trainingItems || []" :trainingId="selectedId" />

    <h2>Select training </h2>
    <TableSelector :trainingItems="trainingItems" @select="(id) => { selectedId = id }" />
  </main>
</template>

<style scoped>
main {
  color: #ffffff;
}
</style>

<script lang="ts" setup>
import StatChart from '../components/StatChart.vue'
import TableSelector from '../components/TableSelector.vue'

</script>

<script lang="ts">
import { apiManager } from '../main';
import type { apiDataTrainingListType } from '../dev/types';

export default {
  data() {
    return {
      trainingItems: [] as apiDataTrainingListType[],
      selectedId: undefined as undefined | number
    }
  },
  methods: {
    apiTrainingList: function (force: boolean) {
      apiManager.call<apiDataTrainingListType[]>("/training/list", {}, force)
        .then(r => {
          // @ts-ignore
          this.trainingItems = r;
          if (this.selectedId == undefined)
            this.selectedId = this.trainingItems.sort((x, y) => y.nbGen - x.nbGen)[0].id

        })
        .catch(e => { console.log(e); alert(e.code) })
    },
  },

  beforeMount: function () {
    this.apiTrainingList(false);
  },
  mounted: function () {
    setInterval(() => {
      this.apiTrainingList(false);
    }, 5000)
  }
}

</script>
