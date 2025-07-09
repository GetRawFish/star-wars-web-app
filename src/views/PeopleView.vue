<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePageTitle } from '@/composables/usePageTitle'
import { useFetch, useFetchResources } from '@/composables/useFetch'
import { useFilterByQuery } from '@/composables/useFilterByQuery'
import { useSort } from '@/composables/useSort'
import { useUtils } from '@/composables/useUtils'
import type { Resource, PersonResponse } from '@/types/interfaces'
import { SortDirection, SortField } from '@/types/enums'
import {
  emptyMessage,
  errorMessage,
  contentMainClass,
  contentTitleClass,
  contentContainerClass,
  contentListClass,
  contentEmptyClass,
  contentEmptyMessageClass,
} from '@/utils/consts'

import ContentFilter from '@/components/ContentFilter.vue'
import PersonCard from '@/components/PersonCard.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'

usePageTitle('SW | Many faces')

const router = useRouter()
const { doSortByDate, doSortByName } = useSort()
const { isEmptyArray, calcTotalPages, chunkArray } = useUtils()

const content = ref<HTMLElement | null>(null)
const currentPage = defineModel<number>('currentPage', { default: 1 })
const showLoading = ref(true)
const showError = ref(false)

const sortNameBy = ref<SortDirection>(SortDirection.none)
const sortDateBy = ref<SortDirection>(SortDirection.none)

const filteredPeople = ref<PersonResponse[]>([])

const {
  data: people,
  error: fetchError,
  doFetch: fetchPeople,
} = useFetch<PersonResponse[]>('https://swapi.info/api/people')
const { doFilter } = useFilterByQuery<PersonResponse[]>()

const totalPages = computed(() => calcTotalPages(filteredPeople.value))
const isEmpty = computed(() => isEmptyArray(filteredPeople.value))

const computedPeople = computed(
  () => chunkArray(filteredPeople.value, currentPage.value) as PersonResponse[],
)

function resetPagination(): void {
  router.push({ name: 'people', params: { page: 1 } })
  currentPage.value = 1
}

function sortPeople(): void {
  if (sortNameBy.value !== SortDirection.none) {
    filteredPeople.value = filteredPeople.value.sort((a, b) => {
      return doSortByName(a.name, b.name, sortNameBy.value)
    })
  } else if (sortDateBy.value !== SortDirection.none) {
    filteredPeople.value = filteredPeople.value.sort((a, b) => {
      return doSortByDate(a.created, b.created, sortDateBy.value)
    })
  }
}

function doSearch(query: string): void {
  resetPagination()
  filteredPeople.value = doFilter(people.value, query) as PersonResponse[]

  sortPeople()
}

function doSort(sortField: SortField): void {
  resetPagination()

  // Choose sort direction
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

  sortPeople()
}

onMounted(async () => {
  await fetchPeople()

  if (fetchError.value) {
    showLoading.value = false
    showError.value = true
  }

  if (people.value) {
    try {
      // Process all people in parallel for better performance
      await Promise.all(
        people.value.map(async (person) => {
          try {
            // Fetch homeworld data
            const { data: homeworldData, doFetch: fetchHomeworld } = useFetch<Resource>(
              person.homeworld,
            )
            await fetchHomeworld()
            person.homeworld = homeworldData.value?.name ?? ''

            // Process all related data in parallel
            const [films, species, vehicles, starships] = await Promise.all([
              useFetchResources(person.films, 'title'),
              useFetchResources(person.species),
              useFetchResources(person.vehicles),
              useFetchResources(person.starships),
            ])

            // Assign the fetched data
            person.films = films.filter((film) => typeof film === 'string')
            person.species = species.filter((specie) => typeof specie === 'string')
            person.vehicles = vehicles.filter((vehicle) => typeof vehicle === 'string')
            person.starships = starships.filter((starship) => typeof starship === 'string')
          } catch (error) {
            console.error(`Error processing person data:`, error)
            showError.value = true
          }
        }),
      )
    } finally {
      filteredPeople.value = people.value
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
    <h1 :class="contentTitleClass">People</h1>
    <ContentFilter
      :sort-name-by="sortNameBy"
      :sort-date-by="sortDateBy"
      sort-name-id="person-name-sort"
      sort-date-id="person-date-sort"
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
        <PersonCard v-for="(person, index) in computedPeople" :key="index" :details="person" />
      </div>
    </div>
    <PaginationComponent
      v-if="!isEmpty && !showError"
      :totalPages="totalPages"
      to-path-name="people"
      v-model:current-page="currentPage"
    />
  </main>
</template>

<style lang="sass">
@use '@/assets/sass/layout/content'
</style>
