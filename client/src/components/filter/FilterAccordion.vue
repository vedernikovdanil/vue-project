<template>
  <div class="card accordion mb-3">
    <AccordionItem
      :id="filter.name"
      :name="filter.title"
      :class="{'active': filter.active}"
      v-for="filter in filterList"
    >
      <FilterItem
        v-bind="filter"
        v-model="filter.value"
        v-model:active="filter.active"
      />
    </AccordionItem>
  </div>
  <slot></slot>
</template>

<script setup>
import FilterItem from '@/components/filter/FilterItem.vue';
import AccordionItem from '@/components/AccordionItem.vue';

const props = defineProps({
  filterList: { type: Array, required: true }
});
</script>

<style>
  .active .accordion-button {
    color: var(--bs-accordion-active-color) !important;
    background-color: var(--bs-accordion-active-bg) !important;
  }
  .accordion-button {
    color: var(--bs-accordion-btn-color) !important;
    background-color: var(--bs-accordion-btn-bg) !important;
  }
</style>