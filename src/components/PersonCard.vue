<script setup lang="ts">
import type { PersonResponse } from '@/types/interfaces'
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
  details: PersonResponse
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
          >Height: <span :class="cardDetailsTextClass">{{ details.height }} m</span></span
        >
      </p>
      <p>
        <span
          >Mass: <span :class="cardDetailsTextClass">{{ details.mass }} kg</span></span
        >
      </p>
      <p>
        <span
          >Hair color: <span :class="cardDetailsTextClass">{{ details.hair_color }}</span></span
        >
      </p>
      <p>
        <span
          >Skin color: <span :class="cardDetailsTextClass">{{ details.skin_color }}</span></span
        >
      </p>
      <p>
        <span
          >Eye color: <span :class="cardDetailsTextClass">{{ details.eye_color }}</span></span
        >
      </p>
    </div>
    <div :class="cardDetailsClass">
      <p>
        <span
          >Birth year: <span :class="cardDetailsTextClass">{{ details.birth_year }}</span></span
        >
      </p>
      <p>
        <span
          >Gender: <span :class="cardDetailsTextClass">{{ details.gender }}</span></span
        >
      </p>
      <p>
        <span
          >Homeworld: <span :class="cardDetailsTextClass">{{ details.homeworld }}</span></span
        >
      </p>
    </div>
    <div v-if="isNotEmptyArray(details.films)" :class="cardDetailsListClass">
      <p>Films:</p>
      <ul :class="cardDetailsTextClass">
        <li v-for="(film, index) in details.films" :key="index">{{ film }}</li>
      </ul>
    </div>
    <div v-if="isNotEmptyArray(details.species)" :class="cardDetailsListClass">
      <p>Species:</p>
      <ul :class="cardDetailsTextClass">
        <li v-for="(specie, index) in details.species" :key="index">{{ specie }}</li>
      </ul>
    </div>
    <div v-if="isNotEmptyArray(details.vehicles)" :class="cardDetailsListClass">
      <p>Vehicles:</p>
      <ul :class="cardDetailsTextClass">
        <li v-for="(vehicle, index) in details.vehicles" :key="index">{{ vehicle }}</li>
      </ul>
    </div>
    <div v-if="isNotEmptyArray(details.starships)" :class="cardDetailsListClass">
      <p>Starships:</p>
      <ul :class="cardDetailsTextClass">
        <li v-for="(starship, index) in details.starships" :key="index">{{ starship }}</li>
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
