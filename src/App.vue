<template>
  <div class="app">
    <Sidebar />

    <router-view />
  </div>
</template>

<style>
@import url(http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900italic,900);

:root {
  --primary-text: #F7FAFA;
  --secondary-text: #8A9EBF;
  --primary: #F5C754;
  --secondary: #33D196;
  --third: #e74c3c;
  --dark: #121C24;
  --light: #29384D;
  --stroke: #33405C;
  --sidebar-width: 25rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

body {
  background: var(--dark);
}

button {
  cursor: pointer;
}

.app {
  display: flex;
  width: 1500px;
  margin-left: auto;
  margin-right: auto;

  main {
    flex: 1 1 0;
    padding: 2rem;
  }

  /* Disable text selection */
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>

<script lang="ts" setup>
import Sidebar from './components/Sidebar.vue'
</script>

