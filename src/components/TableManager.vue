<template>
  <div class="table">
    <table>
      <thead>
        <tr>
          <th v-for="key in columns" @click="sort(key)">
            <div class="key">
              {{ key }}
              <img v-if="key !== sortBy" src="/arrow_up.svg" />
              <img v-if="key === sortBy && sortAsc" class="currentKey" src="/arrow_up.svg" />
              <img v-if="key === sortBy && !sortAsc" class="currentKey" src="/arrow_down.svg" />
            </div>
          </th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in trainingItems">
          <td v-for="key in columns">
            {{ // @ts-ignore
              entry[key] }}
          </td>
          <td v-if="entry.id === currentTraining" class="end" @click="apiEnd()">
            <p>End</p>
          </td>
          <td v-else class="start" @click="apiStart(entry.id)">
            <p>Start</p>
          </td>

        </tr>

      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-radius: 4px;
  border: 1px solid var(--light);

  margin-top: 2rem;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: var(--light);
    border-radius: 4px;
  }

  td {
    padding: 8px;
    text-align: center;
    height: 4rem;
    border-bottom: 1px solid var(--primary-text);
  }

  th {
    height: 2rem;
    border-bottom: 1px solid var(--primary-text);
    cursor: pointer;

    .key {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        fill: red;
        filter: brightness(0) invert(1);
        opacity: 0.2;
        width: 32px;
        height: 32px;
        padding-left: 5px;
      }

      .currentKey {
        opacity: 1;
      }
    }

  }

  tr {
    transition: 200ms;
  }

  tr:hover {
    background-color: var(--light);
  }

  p {
    cursor: pointer;
    color: black;
    border-radius: 4px;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  }

  .start p {
    background-color: var(--secondary);
  }

  .start p:hover {
    box-shadow: 0 0 4px var(--secondary);
  }

  .start p:active {
    box-shadow: 0 0 0 var(--secondary);
  }

  .end p {
    background-color: var(--third);
  }

  .end p:hover {
    box-shadow: 0 0 4px var(--third);
  }

  .end p:active {
    box-shadow: 0 0 0 var(--third);
  }
}
</style>

<script lang="ts">
import type { apiDataTrainingListType, valueof } from '../dev/types';
import { apiManager } from '../main'

export default {
  props: {
    currentTraining: { type: Number, require: true },
    isTraining: { type: Boolean, require: true }
  },
  data() {
    return {
      trainingItems: [] as apiDataTrainingListType[],
      columns: ["id", "nbGen", "best", "average", "nbNetwork", "groupSize"] as (keyof apiDataTrainingListType)[],
      sortBy: "nbGen" as keyof apiDataTrainingListType,
      sortAsc: true,
    }
  },

  methods: {
    apiTrainingList: function (force: boolean) {
      apiManager.call<apiDataTrainingListType[]>("/training/list", {}, force)
        .then(r => {
          // @ts-ignore
          this.trainingItems = r.sort((x, y) => (y[this.sortBy] - x[this.sortBy]) * (this.sortAsc ? 1 : -1))
        })
        .catch(e => { console.log(e); alert(e.code) })
    },
    apiStart: function (id: number) {
      if (this.isTraining) {
        alert(`Training ${this.currentTraining} is running. Stop it in order to start a new one`);
        return;
      }

      apiManager.call<any>("/training/start", { id }, false)
        .then(() => {
          this.$emit('trainingStart', id)
        })
        .catch((e) => { alert(`${e.code}`) })
    },
    apiEnd: function () {
      apiManager.call<any>("/training/end", {}, false)
        .then(() => { this.$emit('trainingEnd') })
        .catch((e) => { alert(`${e.code}`) })
    },
    sort: function (key: string) {
      // @ts-ignore
      this.trainingItems = this.trainingItems.sort((x, y) => (y[key] - x[key]) * (this.sortAsc ? 1 : -1))

      if (this.sortBy === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortAsc = true;
      }

      this.sortBy = key as keyof apiDataTrainingListType;

    }
  },

  beforeMount: function () {
    this.apiTrainingList(false);
  }
}
</script>
