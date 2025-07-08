<script setup lang="ts">
// import { computed } from 'vue'

type Props = {
  showLoading?: boolean
}

const mainClass = 'loading'

const { showLoading = false } = defineProps<Props>()
</script>

<template>
  <Transition name="fade">
    <div v-if="showLoading" :class="mainClass">
      <label :class="`${mainClass}__content`">
        <progress max="100" indeterminate class="visually-hidden" />
        <i aria-hidden="true" class="icon--jedi" />
        <span class="text--l text--medium">Loading ...</span>
      </label>
    </div>
  </Transition>
</template>

<style lang="sass">
@use '@/assets/sass/components/loading'
@use '@/assets/sass/base/transitions'
</style>
