<template>
  <div class="setup">
    <div class="form">
      <div class="item item1">
        <p>Id</p>
        <input v-model.number="formId" />
      </div>
      <div class="item item1">
        <p>Number of networks</p>
        <input v-model.number="formNb" />
      </div>
      <div class="item item2">
        <p>Group Size</p>
        <input v-model.number="formGSize" />
      </div>
    </div>

    <div class="right">
      <button @click=apiCreate>Create</button>
    </div>
  </div>
</template>

<style scope>
.setup {
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 4rem;

  .form {
    width: 60%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .item {
      padding: 1rem 0rem;

      p {
        color: var(--primary-text);
        font-size: 16px;
        height: 1.5rem;
      }

      input {
        width: 100%;
        height: 3rem;
        background-color: #1C2936;
        font-size: 18px;
        color: var(--primary-text);
        border: 2px solid var(--stroke);
        border-radius: 4px;
      }
    }

    .item1 {
      width: 48%;
    }

    .item2 {
      width: 100%;
    }
  }

  .right {
    display: flex;
    justify-content: flex-end;

    button {
      background-color: var(--primary);
      border: 0px solid var(--stroke);
      border-radius: 4px;
      width: 7rem;
      height: 2rem;
      font-size: 18px;
    }

    button:hover {
      box-shadow: 0 0 4px var(--primary);
    }

    button:active {
      box-shadow: 0 0 0 var(--primary);
    }
  }
}
</style>

<script lang="ts">
import { apiManager } from '../main'

export default {
  data() {
    return {
      formId: null,
      formNb: null,
      formGSize: null
    }
  },
  methods: {
    apiCreate: function () {
      const check: boolean = !(isNaN(this.formId as any) || isNaN(this.formNb as any) || isNaN(this.formGSize as any));

      const id = this.formId === "" ? 0 : this.formId;
      const nbNetwork = this.formNb === "" ? 0 : this.formNb;
      const groupSize = this.formGSize === "" ? 0 : this.formGSize;

      if (!check || id === 0 || nbNetwork === 0 || groupSize === 0) {
        return;
      }

      apiManager.call<any>("/training/create", { id, groupSize, nbNetwork }, false)
        .then(() => { alert(`Training ${id} created!`) })
        .catch((e) => { alert(`${e.code}`) })
    },
  }
}
</script>
