<template>
  <div class="m-2">
    <input
      class="form-control"
      type="search"
      :placeholder="searchPlaceholder"
      v-model="searchValue"
      @input="onInputSearch"
      v-if="options.length > maxShowCount"
    >
  </div>
  <ul class="list-group list-group-flush" :class="$attrs.class" ref="listGroup" v-show="filteredOptions.length">
    <li class="list-group-item list-group-item-action" v-for="option in filteredOptions">
      <div class="form-check d-grid">
        <input
          class="form-check-input"
          :type="inputType"
          :value="option.value"
          :id="inputId(option.value)"
          v-model="checkedValue"
        >
        <label class="form-check-label stretched-link text-truncate me-1" :for="inputId(option.value)">
          {{ option.name || option.value }}
        </label>
        <span class="text-muted">({{ option.count }})</span>
      </div>
    </li>
  </ul>
  <div class="px-3" v-if="!filteredOptions.length">
    there's nothing here
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue';
import _ from 'lodash';

const props = defineProps({
  name: { type: String, required: true },
  title: { type: String, required: true },
  options: { type: Array, required: true },
  radio: { type: Boolean, default: false },
  maxShowCount: { type: Number, default: 7 },
  showAll: { type: [Boolean, Number], required: false },
  modelValue: { type: [Array, String], required: null },
});

const emit = defineEmits(['update:modelValue', 'update:showAll']);

const checkedValue = ref(props.modelValue);
const searchValue = ref('');
const listGroup = ref(null);
let checkedValueBuffer = checkedValue.value;

const inputType = computed(() => props.radio ? 'radio' : 'checkbox' );
const searchPlaceholder = computed(() => `Search ${_.lowerCase(props.title)}` );

const sortedOptions = computed(() => {
  const sorted = props.options;
  if (props.options.length > props.maxShowCount) {
    sorted.sort((a, b) => props.showAll ? a.name.localeCompare(b.name) : b.count - a.count);
    sorted.sort(sortByChecked);
  }
  return props.showAll ? sorted : sorted.slice(0, props.maxShowCount);
});

const filteredOptions = computed(() =>
  searchValue.value.length
    ? props.options.filter(o => o.name.toLowerCase().includes(searchValue.value.toLowerCase()))
    : sortedOptions.value
);

watchEffect(() => emit('update:modelValue', checkedValue.value));
watchEffect(() => checkedValue.value = props.modelValue);
watch(() => props.showAll, () => listGroup.value.scrollTop = 0);
watch(() => props.showAll, () => checkedValueBuffer = checkedValue.value);

const inputId = (id) => `${props.name}-${id}`;
const onInputSearch = (event) => emit('update:showAll', event.target.value.length && -1);
const sortByChecked = (a, b) => checkedValueBuffer.includes(b.value) - checkedValueBuffer.includes(a.value);
</script>

<style lang="">

</style>