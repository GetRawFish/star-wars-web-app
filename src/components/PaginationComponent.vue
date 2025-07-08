<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

type Props = {
  toPathName: string
  totalPages: number
}

const { totalPages = 1, toPathName } = defineProps<Props>()

const mainClass = 'pagination'
const stepClass = `${mainClass}__step`

const route = useRoute()
const currentPage = defineModel<number>('currentPage', { default: 1 })

if (route.params.page) {
  currentPage.value = Number(route.params.page)
}

const pages = computed(() => Array.from({ length: totalPages }, (_, index) => index + 1))
const nextPage = computed(() => currentPage.value + 1)
const prevPage = computed(() => currentPage.value - 1)
const isPrevDisabled = computed(() => currentPage.value < 2)
const isNextDisabled = computed(() => currentPage.value >= totalPages)
const isMoreThenOne = computed(() => totalPages > 1)

function isCurrentArea(page: number): string | boolean {
  return currentPage.value === page ? 'page' : false
}

function tabindexValue(isDisabled: boolean): number {
  return isDisabled ? -1 : 0
}

function updateCurrentPage(page: number): void {
  if (currentPage.value === page) return

  currentPage.value = page
}
</script>

<template>
  <nav aria-label="Pagination" :class="mainClass">
    <ul>
      <li v-if="isMoreThenOne">
        <RouterLink
          :to="{ name: toPathName, params: { page: prevPage } }"
          :aria-disabled="isPrevDisabled"
          :tabindex="tabindexValue(isPrevDisabled)"
          :class="[stepClass, 'text--s']"
          @click="updateCurrentPage(prevPage)"
        >
          <span class="text--s">Previous</span>
        </RouterLink>
      </li>

      <li v-for="page in pages" :key="page">
        <RouterLink
          :to="{ name: toPathName, params: { page: page } }"
          :aria-current="isCurrentArea(page)"
          :tabindex="tabindexValue(currentPage === page)"
          :class="[`${mainClass}__page`, 'text--s']"
          @click="updateCurrentPage(page)"
        >
          <span class="visually-hidden">Page {{ page }}</span>
          <span aria-hidden="true">{{ page }}</span>
        </RouterLink>
      </li>

      <li v-if="isMoreThenOne">
        <RouterLink
          :to="{ name: toPathName, params: { page: nextPage } }"
          :aria-disabled="isNextDisabled"
          :tabindex="tabindexValue(isNextDisabled)"
          :class="[stepClass, 'text--s']"
          @click="updateCurrentPage(nextPage)"
        >
          <span class="text--s">Next</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="sass">
@use '@/assets/sass/components/pagination'
</style>
