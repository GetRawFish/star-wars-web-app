<script setup lang="ts">
const mainClass = 'home'
const navClass = `${mainClass}__nav`
const linkClass = `${navClass}__link`
</script>

<template>
  <main :class="['container-main', mainClass]">
    <div :class="`${mainClass}__content`">
      <img alt="Star Wars logo" src="@/assets/img/logo.svg" width="500" height="auto" />
      <h1 class="text--title text--light text--grey-light">
        Decide where to&nbsp;go, you&nbsp;will.
      </h1>
      <nav :class="navClass">
        <RouterLink :to="{ name: 'people' }" :class="['text--l', 'text--grey-light', linkClass]"
          >People</RouterLink
        >
        <RouterLink :to="{ name: 'planets' }" :class="['text--l', 'text--grey-light', linkClass]"
          >Planets</RouterLink
        >
      </nav>
    </div>
  </main>
</template>

<style lang="sass">
@use '@/assets/sass/views/home'
</style>
