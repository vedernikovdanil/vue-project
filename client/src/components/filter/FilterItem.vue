<template>
  <div>
    <component
      :is="filterComponent"
      class="filter-option"
      :class="{'overflow-auto': showAll}"
      :maxShowCount="maxShowCount"
      v-bind="props"
      v-model:showAll="showAll"
      v-model="checkedValue"
    >
    </component>
    <div class="d-flex justify-content-between p-2">
      <a href="javascript:void(0);" :class="{'invisible': !overflowed}" @click="toggleShowAll"> {{ showAllText }} </a>
      <a href="javascript:void(0);" :class="{'invisible': !active}" @click="reset">Reset</a>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, computed, watchEffect } from 'vue';
import FilterRange from '@/components/filter/types/FilterRange.vue';
import FilterText from '@/components/filter/types/FilterText.vue';

const props = defineProps({
  title: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  options: { type: Array, required: true },
  radio: { type: Boolean, default: false },
  defaultValue: { type: [Array, String], default: null },
  modelValue: { type: [Array, String], default: null }
});

const emit = defineEmits(['update:modelValue', 'update:active']);

const checkedValue = ref(props.modelValue);
const maxShowCount = ref(7);
const showAll = ref(false);

const filterComponent = computed(() => props.type === 'range' ? FilterRange : FilterText);
const active = computed(() => !_.isEqual(_.sortBy(checkedValue.value), _.sortBy(props.defaultValue)));
const overflowed = computed(() => props.options.length > maxShowCount.value && showAll.value !== -1);
const showAllText = computed(() => showAll.value ? 'Hide All' : 'Show All' );

watchEffect(() => emit('update:modelValue', checkedValue.value));
watchEffect(() => emit('update:active', active.value));
watchEffect(() => checkedValue.value = props.modelValue);

const toggleShowAll = () => showAll.value = !showAll.value;
const reset = () => checkedValue.value = props.defaultValue;

</script>

<style>
  .filter-option {
    --maxShowCount: 7;
    max-height: calc(42px * var(--maxShowCount));
  }
  .filter-option .form-check {
    grid-template-columns: repeat(3, auto);
    justify-content: start;
  }
</style>