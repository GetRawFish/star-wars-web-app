<script setup lang="ts">
import { usePageTitle } from '@/composables/usePageTitle'

const mainClass = 'home'
const navClass = `${mainClass}__nav`
const linkClass = `${navClass}__link`

usePageTitle('SW | Much to learn')
</script>

<template>
  <main :class="['container-main', mainClass]">
    <div :class="`${mainClass}__content`">
      <img alt="Star Wars logo" src="@/assets/img/logo.svg" width="500" height="auto" />
      <h1 class="text--title text--light text--grey-light">
        <span class="visually-hidden">Decide where to go, you will.</span>
        <span aria-hidden="true">Decide where to&nbsp;go, you&nbsp;will.</span>
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
