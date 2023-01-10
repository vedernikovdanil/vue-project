<template>
  <div class="d-flex align-items-center gap-2 mb-3">
    <div class="d-flex gap-2 align-items-center">
      <div class="input-group flex-nowrap">
        <button class="btn btn-outline-secondary w-100" type="button" @click="toggleDesc">{{ descText }}</button>
        <select class="form-select w-100" v-model="order">
          <option value="undefined" selected disabled>Select sort type</option>
          <option value="Name">Name</option>
          <option value="Price">Price</option>
          <option value="Rate">Rate</option>
          <option value="InStock">Stock</option>
          <option value="DateRelease">Newest</option>
        </select>
      </div>
      <button class="btn btn-outline-secondary" @click="reset">Reset</button>
      <button class="btn btn-secondary d-lg-none" @click="clickFilter">Filter</button>
    </div>
    <div class="d-flex gap-1 ms-auto">
      <input class="d-none" type="radio" :value="false" id="productGridView0" title="stack view" v-model="gridView">
      <label class="btn" :class="`btn${gridView ? '-outline' : ''}-secondary`" for="productGridView0">
        <i class="bi bi-view-stacked"></i>
      </label>
      <input class="d-none" type="radio" :value="true" id="productGridView1" title="grid view" v-model="gridView">
      <label class="btn" :class="`btn${gridView ? '' : '-outline'}-secondary`" for="productGridView1">
        <i class="bi bi-grid"></i>
      </label>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, computed, watchEffect, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
  gridView: { type: Boolean, required: true },
});
const emit = defineEmits(['update:modelValue', 'update:gridView', 'openFilter']);
const gridViewDefault = props.gridView;
const gridView = ref(gridViewDefault);
const desc = ref(false);
const order = ref('');

const descText = computed(() => desc.value ? 'Descending' : 'Ascending');

watchEffect(() => emit('update:gridView', gridView.value));
watchEffect(() => {
  order.value = props.modelValue.order;
  desc.value = props.modelValue.desc;
});
watch([order, desc], () => {
  const propsSettings = {order: props.modelValue.order, desc: props.modelValue.desc};
  const settingsCheck = {order: order.value, desc: desc.value};
  if (_.isEqual(propsSettings, settingsCheck)) {
    return;
  }
  if (desc.value && !order.value?.length) {
    order.value = 'Price';
  }
  const settings = {
    order: order.value,
    desc: desc.value
  };
  const params = Object.entries(settings).filter(([,value]) => value === true || value?.length);
  emit('update:modelValue', _.fromPairs(params));
});

const toggleDesc = () => desc.value = !desc.value;
const clickFilter = () => emit('openFilter');
function reset() {
  gridView.value = gridViewDefault;
  desc.value = false;
  order.value = '';
}
</script>

<style scoped>
  .input-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>