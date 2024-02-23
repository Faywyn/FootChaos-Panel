<template>
  <aside>

    <div class="menu">
      <router-link class="button" to="/">
        <img src="/home.svg" />
        <span class="text">Dashboard</span>
      </router-link>
      <router-link class="button" to="/training">
        <img src="/play.svg" />
        <span>Training</span>
      </router-link>
      <router-link class="button" to="/analysis">
        <img src="/stats.svg" />
        <span>Analysis</span>
      </router-link>
    </div>
  </aside>
</template>

<script lang="ts" ></script>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  min-height: 100vh;
  overflow: hidden;
  padding: 1rem;

  background-color: var(--dark);
  color: #ffffff;

  .menu {
    width: 100%;

    .button {
      width: 80%;
      display: flex;
      align-items: center;
      text-decoration: none;

      padding: 0rem 1rem;
      margin: 1rem 1rem;
      border-radius: 4px;

      img {
        width: 24px;
      }

      span {
        color: #ffffff;
        font-size: 20px;
        padding: 0.8rem;
      }

      &.router-link-exact-active {
        background-color: var(--light);
      }

    }

    img {

      filter: brightness(0) invert(1);
    }
  }
}
</style>
