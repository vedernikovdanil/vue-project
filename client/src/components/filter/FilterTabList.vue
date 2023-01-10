<template>
  <form class="row g-0 gap-2 overflow-hidden h-100" id="filterTabList">
    <div class="col-md-4 col-5 overflow-auto h-100">
      <div class="card p-3 nav flex-column nav-pills gap-2 mb-3" aria-orientation="vertical">
        <button
          type="button"
          class="nav-link border"
          :class="{'checked': filter.active, 'active': currentTab === tabId(filter.name)}"
          :id="tabId(filter.name)"
          :data-bs-target="`#${panelId(filter.name)}`"
          :aria-controls="panelId(filter.name)"
          data-bs-toggle="pill"
          role="tab"
          @click.prevent="changeTab"
          v-for="filter in filterList"
        >
          {{ filter.title }}
        </button>
      </div>
      <slot></slot>
    </div>
    <div class="tab-content col overflow-auto h-100">
      <div
        class="tab-pane"
        :id="panelId(filter.name)"
        role="tabpanel"
        :aria-labelledby="tabId(filter.name)"
        tabindex="0"
        v-for="filter in filterList"
      >
        <FilterItem
          v-bind="filter"
          v-model="filter.value"
          v-model:active="filter.active"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Tab } from 'bootstrap';
import FilterItem from '@/components/filter/FilterItem.vue';

const props = defineProps({
  filterList: { type: Array, required: true },
});
const currentTab = ref('');

onMounted(() => {
  currentTab.value = document.querySelector('#filterTabList .nav:first-child button').id;
  Tab.getOrCreateInstance(`#${currentTab.value}`).show();
});

const changeTab = (event) => currentTab.value = event.target.id;
const tabId = (id) => `v-pills-${id}-tab`;
const panelId = (id) => `v-pills-${id}`;
</script>

<style>
  #filterTabList .filter-option {
    --maxShowCount: '';
  }
  #filterTabList .nav-link.checked {
    --bs-bg-opacity: .2;
    background-color: rgba(var(--bs-primary-rgb), var(--bs-bg-opacity)) !important;
  }
  #filterTabList .nav-link.checked:not(.active) {
    color: var(--bs-nav-link-color);
  }
  #filterTabList .nav-link.active.checked {
    --bs-bg-opacity: .75;
  }
</style>