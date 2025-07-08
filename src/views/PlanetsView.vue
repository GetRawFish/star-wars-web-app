<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch, useFetchResources } from '@/composables/useFetch'
import { useFilterByQuery } from '@/composables/useFilterByQuery.ts'
import { useSort } from '@/composables/useSort.ts'
import { useUtils } from '@/composables/useUtils.ts'
import type { PlanetResponse } from '@/utils/interfaces.ts'
import { SortDirection, SortField } from '@/utils/enums.ts'
import {
  emptyMessage,
  errorMessage,
  contentMainClass,
  contentTitleClass,
  contentContainerClass,
  contentListClass,
  contentEmptyClass,
  contentEmptyMessageClass,
} from '@/utils/consts.ts'

import ContentFilter from '@/components/ContentFilter.vue'
import PlanetCard from '@/components/PlanetCard.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'

const router = useRouter()
const { doSortByDate, doSortByName } = useSort()
const { isEmptyArray, calcTotalPages, chunkArray } = useUtils()

const content = ref<HTMLElement | null>(null)
const currentPage = defineModel<number>('currentPage', { default: 1 })
const showLoading = ref(true)
const showError = ref(false)

const sortNameBy = ref<SortDirection>(SortDirection.none)
const sortDateBy = ref<SortDirection>(SortDirection.none)

const filteredPlanets = ref<PlanetResponse[]>([])

const {
  data: planets,
  error: fetchError,
  doFetch: fetchPlanets,
} = useFetch<PlanetResponse[]>('https://swapi.info/api/planets')
const { doFilter } = useFilterByQuery<PlanetResponse[]>()

const totalPages = computed(() => calcTotalPages(filteredPlanets.value))
const isEmpty = computed(() => isEmptyArray(filteredPlanets.value))

const computedPlanets = computed(
  () => chunkArray(filteredPlanets.value, currentPage.value) as PlanetResponse[],
)

function resetPagination(): void {
  router.push({ name: 'planets', params: { page: 1 } })
  currentPage.value = 1
}

function doSearch(query: string): void {
  resetPagination()
  filteredPlanets.value = doFilter(planets.value, query) as PlanetResponse[]
}

function doSort(sortField: SortField): void {
  resetPagination()

  // choose sort direction
  function sortDirection(currentSort: SortDirection): SortDirection {
    return currentSort === SortDirection.desc || currentSort === SortDirection.none
      ? SortDirection.asc
      : SortDirection.desc
  }

  if (sortField === SortField.name) {
    sortDateBy.value = SortDirection.none
    sortNameBy.value = sortDirection(sortNameBy.value)
  } else {
    sortNameBy.value = SortDirection.none
    sortDateBy.value = sortDirection(sortDateBy.value)
  }

  if (sortNameBy.value !== SortDirection.none) {
    filteredPlanets.value = filteredPlanets.value.sort((a, b) => {
      return doSortByName(a.name, b.name, sortNameBy.value)
    })
  } else if (sortDateBy.value !== SortDirection.none) {
    filteredPlanets.value = filteredPlanets.value.sort((a, b) => {
      return doSortByDate(a.created, b.created, sortDateBy.value)
    })
  }
}

onMounted(async () => {
  await fetchPlanets()

  if (fetchError.value) {
    showLoading.value = false
    showError.value = true
  }

  if (planets.value) {
    try {
      // Process all planets in parallel for better performance
      await Promise.all(
        planets.value.map(async (planet) => {
          try {
            // Process all related data in parallel
            const [residents, films] = await Promise.all([
              useFetchResources(planet.residents, 'name'),
              useFetchResources(planet.films, 'title'),
            ])

            // Assign the fetched data
            planet.residents = residents.filter((resident) => typeof resident === 'string')
            planet.films = films.filter((film) => typeof film === 'string')
          } catch (error) {
            console.error(`Error processing planet data:`, error)
            showError.value = true
          }
        }),
      )
    } finally {
      filteredPlanets.value = planets.value
      showLoading.value = false
    }
  }

  watch(currentPage, () => {
    content.value?.scrollTo({
      top: 0,
    })
  })
})
</script>

<template>
  <main
    :class="['container-main', contentMainClass, isEmpty || showError ? contentEmptyClass : '']"
  >
    <h1 :class="contentTitleClass">Planets</h1>
    <ContentFilter
      :sort-name-by="sortNameBy"
      :sort-date-by="sortDateBy"
      @do-sort="doSort"
      @do-submit="doSearch"
    />
    <div ref="content" aria-live="polite" :aria-busy="showLoading" :class="contentContainerClass">
      <LoadingComponent :show-loading="showLoading" />
      <div
        v-if="showError"
        :class="[contentEmptyMessageClass, 'text--red']"
        v-html="errorMessage"
      />
      <p v-else-if="isEmpty" :class="contentEmptyMessageClass" v-html="emptyMessage" />
      <div v-else :class="contentListClass">
        <PlanetCard v-for="(planet, index) in computedPlanets" :key="index" :details="planet" />
      </div>
    </div>
    <PaginationComponent
      v-if="!isEmpty && !showError"
      :totalPages="totalPages"
      to-path-name="planets"
      v-model:current-page="currentPage"
    />
  </main>
</template>

<style lang="sass">
@use '@/assets/sass/layout/content'
</style>
