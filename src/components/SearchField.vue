<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  label?: string
  formLabel?: string
  inputId?: string
  inputName?: string
  placeholder?: string
}

const {
  label = 'Search by name',
  formLabel = 'Form label',
  inputId = 'search-input',
  inputName = 'query',
  placeholder = 'Search by name ...',
} = defineProps<Props>()

const mainClass = 'search-field'
const clearLabel = 'Clear'

const query = defineModel<string>('query')
const emit = defineEmits(['doSubmit'])

const showClear = computed(() => query.value && query.value.trim().length >= 1)

function doSubmit(): void {
  emit('doSubmit', query.value)
}

function clearQuery(): void {
  query.value = ''
  doSubmit()
}
</script>

<template>
  <form
    role="search"
    autocomplete="off"
    :aria-label="formLabel"
    :class="mainClass"
    @submit.prevent="doSubmit()"
  >
    <label :for="inputId" class="visually-hidden">{{ label }}</label>
    <input
      type="search"
      :id="inputId"
      :name="inputName"
      :placeholder="placeholder"
      autocomplete="off"
      :class="[`${mainClass}__input`, 'text--l', 'text--light', 'text--white']"
      v-model="query"
    />
    <Transition name="fade">
      <button
        v-if="showClear"
        type="button"
        :aria-label="clearLabel"
        :class="[`${mainClass}__clear`, 'text--xs']"
        @click="clearQuery"
      >
        <span class="visually-hidden">{{ clearLabel }}</span>
      </button>
    </Transition>
    <button type="submit" tabindex="-1" :aria-label="label" :class="`${mainClass}__submit`">
      <span class="visually-hidden">{{ label }}</span>
      <i class="icon--search" />
    </button>
  </form>
</template>

<style lang="sass">
@use '@/assets/sass/components/search-field'
@use '@/assets/sass/base/transitions'
</style>
