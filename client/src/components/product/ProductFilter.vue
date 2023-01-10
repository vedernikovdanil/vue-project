<template>
  <component
    :is="modalSettings.component"
    :class="modalSettings.class"
    header="Product Filter"
    @hidden="hideModal"
    @submit.prevent="onSubmit"
    @reset.prevent="onReset"
    ref="modalRef"
  >
    <div
      v-sticky-edges:16="canStickyEdges"
      :class="modalSettings.childClass"
    >
      <input class="form-control mb-3" type="text" placeholder="Search by product" v-model="searchValue">
        <component
          :is="modalSettings.contentComponent"
          :filterList="filterList"
        >
          <div class="card d-grid gap-2 p-3">
            <button type="submit" class="btn btn-primary">Search</button>
            <button type="reset" class="btn btn-secondary">Reset</button>
          </div>
        </component>
    </div>
  </component>
</template>

<script setup>
import { ref,shallowRef, nextTick, watchEffect } from 'vue';
import _ from 'lodash';
import FilterAccordion from '@/components/filter/FilterAccordion.vue';
import FilterTabList from '@/components/filter/FilterTabList.vue';
import vStickyEdges from '@/directives/vStickyEdges';
import Offcanvas from '@/components/Offcanvas.vue';
import { Offcanvas as bsOffcanvas } from 'bootstrap';

const props = defineProps({
  filterList: { type: Array, required: true },
  showModal: { type: Boolean, default: false },
});

const emit = defineEmits(['submit', 'hideModal']);

const modalSettingsHide = {
  component: 'form',
  class: 'd-flex flex-column h-100',
  childClass: 'd-none d-lg-block',
  contentComponent: FilterAccordion
};

const modalSettingsShow = {
  component: Offcanvas,
  class: 'w-100',
  childClass: 'd-flex flex-column h-100',
  contentComponent: FilterTabList
};

const searchValue = ref('');
const modalRef = ref(null);
const modalSettings = shallowRef(modalSettingsHide);

watchEffect(() => props.showModal ? showFilter() : hideModal());

function onSubmit() {
  const filterOutput = props.filterList
    .filter(filter => !_.isEqual(_.sortBy(filter.value), _.sortBy(filter.defaultValue)))
    .map(filter => [filter.name, filter.value]);
  emit('submit', filterOutput);
  if (modalSettings.value.component !== 'form') {
    bsOffcanvas.getOrCreateInstance(modalRef.value.$el).hide();
  }
}
function onReset() {
  props.filterList.forEach(filter => filter.value = filter.defaultValue);
}
function showFilter() {
  modalSettings.value = modalSettingsShow;
  nextTick(() => new bsOffcanvas(modalRef.value.$el).show());
}
function hideModal() {
  modalSettings.value = modalSettingsHide;
  emit('hideModal');
}
const canStickyEdges = () => window.innerWidth > 991;
</script>

<style>
  .card.accordion .accordion-item {
    border: none;
    border-bottom: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color) !important;
  }  
</style>