<script setup lang="ts">
const mainClass = 'header'
const navClass = `${mainClass}__nav`
const linkClass = `${navClass}__link`
</script>

<template>
  <header :class="mainClass">
    <nav :class="navClass">
      <RouterLink
        :to="{ name: 'home' }"
        aria-label="Home"
        :class="['text--l', 'text--grey-light', linkClass]"
      >
        <i aria-hidden="true" class="icon--jedi" />
      </RouterLink>
      <ul>
        <li>
          <RouterLink :to="{ name: 'people' }" :class="['text--l', 'text--grey-light', linkClass]"
            >People</RouterLink
          >
        </li>
        <li>
          <RouterLink :to="{ name: 'planets' }" :class="['text--l', 'text--grey-light', linkClass]"
            >Planets</RouterLink
          >
        </li>
      </ul>
    </nav>
  </header>

  <RouterView />
</template>

<style lang="sass">
@use '@/assets/sass/main'
</style>
