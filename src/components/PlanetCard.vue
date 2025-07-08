<script setup lang="ts">
import type { PlanetResponse } from '@/utils/interfaces'
import { useFormatDate } from '@/composables/useFormatDate'
import { useUtils } from '@/composables/useUtils'
import {
  cardMainClass,
  cardTitleClass,
  cardDetailsClass,
  cardDetailsListClass,
  cardDetailsTextClass,
} from '@/utils/consts'

type Props = {
  details: PlanetResponse
}

const { details } = defineProps<Props>()

const { doFormatToLocaleString } = useFormatDate()
const { isNotEmptyArray } = useUtils()
</script>

<template>
  <article :class="[cardMainClass, 'text--s', 'text--grey-light']">
    <h3 :class="['text--l', 'text--medium', 'text--white', cardTitleClass]">{{ details.name }}</h3>
    <div :class="cardDetailsClass">
      <p>
        <span
          >Rotation period:
          <span :class="cardDetailsTextClass">{{ details.rotation_period }} h</span></span
        >
      </p>
      <p>
        <span
          >Orbital period:
          <span :class="cardDetailsTextClass">{{ details.orbital_period }}°</span></span
        >
      </p>
      <p>
        <span
          >Diameter: <span :class="cardDetailsTextClass">{{ details.diameter }} km</span></span
        >
      </p>
      <p>
        <span
          >Gravity: <span :class="cardDetailsTextClass">{{ details.gravity }}</span></span
        >
      </p>
      <p>
        <span
          >Terrain: <span :class="cardDetailsTextClass">{{ details.terrain }}</span></span
        >
      </p>
      <p>
        <span
          >Surface water:
          <span :class="cardDetailsTextClass">{{ details.surface_water }}</span></span
        >
      </p>
      <p>
        <span
          >Population: <span :class="cardDetailsTextClass">{{ details.population }}</span></span
        >
      </p>
    </div>
    <div v-if="isNotEmptyArray(details.residents)" :class="cardDetailsListClass">
      <p>Residents:</p>
      <ul :class="cardDetailsTextClass">
        <li v-for="(film, index) in details.residents" :key="index">{{ film }}</li>
      </ul>
    </div>
    <div v-if="isNotEmptyArray(details.films)" :class="cardDetailsListClass">
      <p>Films:</p>
      <ul :class="cardDetailsTextClass">
        <li v-for="(specie, index) in details.films" :key="index">{{ specie }}</li>
      </ul>
    </div>
    <p :class="cardDetailsClass">
      Created:
      <span :class="cardDetailsTextClass">{{ doFormatToLocaleString(details.created) }}</span>
    </p>
  </article>
</template>

<style lang="sass">
@use '@/assets/sass/components/card'
</style>
