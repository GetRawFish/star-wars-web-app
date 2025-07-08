<script setup lang="ts">
import { computed } from 'vue'
import { SortDirection } from '@/utils/enums'

type Props = {
  label: string
  sortBy?: SortDirection
}

const { sortBy = SortDirection.none, label } = defineProps<Props>()

const mainClass = 'sort-button'

const emit = defineEmits(['doSort'])

const extendedLabel = computed(() => `Sort items by ${label.toLocaleLowerCase()}`)
const isAsc = computed(() => sortBy === SortDirection.asc)
const isDecs = computed(() => sortBy === SortDirection.desc)
const isPressed = computed(() => sortBy === SortDirection.asc || sortBy === SortDirection.desc)

function doSort(): void {
  emit('doSort')
}
</script>

<template>
  <button
    type="button"
    :aria-label="extendedLabel"
    :aria-pressed="isPressed"
    :class="[mainClass, 'text--s']"
    @click="doSort"
  >
    <span :class="`${mainClass}__label`">{{ label }}</span>
    <span aria-label="hidden" :class="`${mainClass}__direction`">
      <i :class="['icon--sort-up', { active: isAsc }]" />
      <i :class="['icon--sort-down', { active: isDecs }]" />
    </span>
  </button>
</template>

<style lang="sass">
@use '@/assets/sass/components/sort-button'
</style>
