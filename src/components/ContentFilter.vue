<script setup lang="ts">
import { SortDirection, SortField } from '@/types/enums'

import SearchField from '@/components/SearchField.vue'
import SortButton from '@/components/SortButton.vue'

type Props = {
  sortNameBy?: SortDirection
  sortDateBy?: SortDirection
  sortNameId: string
  sortDateId: string
}

const {
  sortNameBy = SortDirection.none,
  sortDateBy = SortDirection.none,
  sortNameId,
  sortDateId,
} = defineProps<Props>()

const mainClass = 'content-filter'
const sortClass = `${mainClass}__sort`
const emit = defineEmits(['doSubmit', 'doSort'])

function doFetch(query: string): void {
  emit('doSubmit', query)
}

function doSort(field: SortField): void {
  emit('doSort', field)
}
</script>

<template>
  <div :class="mainClass">
    <SearchField @do-submit="doFetch" />
    <div aria-label="Sort options" :class="sortClass">
      <span id="sort-label" class="text--s">Sort by:</span>
      <div role="group" aria-labelledby="sort-label" :class="`${sortClass}__buttons`">
        <SortButton
          :id="sortNameId"
          label="Name"
          :sort-by="sortNameBy"
          @do-sort="doSort(SortField.name)"
        />
        <SortButton
          :id="sortDateId"
          label="Created"
          :sort-by="sortDateBy"
          @do-sort="doSort(SortField.date)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@use '@/assets/sass/components/content-filter'
</style>
